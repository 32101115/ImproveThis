import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.gson.reflect.TypeToken;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.io.IOUtils;
import org.joda.time.DateTime;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

public class ImproveThisUtils {
    private static final String USER_INFO_BUCKET = "user.info";
    private static final String SUGGESTION_BUCKET = "improvement.suggestions";

    public static String s3Key( String improvementState, String region, String improvementId ) {

        return improvementState +
               "/" +
               region +
               "/" +
               improvementId +
               "/improvementInstance.json";
    }

    public static ImprovementSuggestion getImprovementSuggestion( String improvementState, String region,
                                                                  String improvementId ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( improvementState, region, improvementId );
        S3Object obj = s3Client.getObject( new GetObjectRequest( SUGGESTION_BUCKET, s3Key ) );
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        try {
            obj.close();
        } catch ( Exception e ) {
            System.out.println( "IOException" );
            return null;
        }
        return new Gson().fromJson( data, ImprovementSuggestion.class );
    }

    public static void upvote( String improvementState, String region, String improvementId ) {
        ImprovementSuggestion suggestion = getImprovementSuggestion( improvementState, region, improvementId );
        suggestion.setUpvotes( suggestion.getUpvotes() + 1 );
        String suggestionJson = new Gson().toJson( suggestion );
        try {
            InputStream jsonStream = IOUtils.toInputStream( suggestionJson, "UTF-8" );
            String s3Key = s3Key( improvementState, region, improvementId );
            AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
            Long length = (long) suggestionJson.length();
            ObjectMetadata md = new ObjectMetadata();
            md.setContentLength( length );
            s3Client.putObject( new PutObjectRequest( SUGGESTION_BUCKET, s3Key, jsonStream, md ) );
            updateTopTen( suggestion );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
    }

    public static void postImprovement( String region, String improvementId, Double xPosition, Double yPosition,
                                        String title, String description, String creator, String location ) {
        ImprovementSuggestion suggestion = ImprovementSuggestion.builder()
                                                                .improvementState( "ONGOING" )
                                                                .creator( creator )
                                                                .region( region )
                                                                .improvementId( improvementId )
                                                                .xPosition( xPosition )
                                                                .yPosition( yPosition )
                                                                .title( title )
                                                                .description( description )
                                                                .upvotes( 0 )
                                                                .discussionCount( 0 )
                                                                .creationDate( DateTime.now().toString() )
                                                                .location( location )
                                                                .build();
        postSuggestion( suggestion );
    }

    public static String getImprovementFromRequest( String improvementState, String region, String improvementId ) {
        ImprovementSuggestion suggestion = getImprovementSuggestion( improvementState, region, improvementId );
        Gson gson = new Gson();
        return gson.toJson( suggestion );
    }

    private static ImprovementSuggestion addComment( ImprovementSuggestion suggestion, String userId, String comment ) {
        ImprovementDiscussion discussion = new ImprovementDiscussion();
        List<ImprovementDiscussion> discussions = suggestion.getDiscussionList();
        discussion.setContents( comment );
        discussion.setPictureList( Lists.newArrayList() );
        discussion.setUserId( userId );
        discussion.setSequenceId( suggestion.getDiscussionCount() );
        suggestion.setDiscussionCount( suggestion.getDiscussionCount() + 1 );
        discussions.add( discussion );
        suggestion.setDiscussionList( discussions );
        return suggestion;
    }

    private static void postSuggestion( ImprovementSuggestion suggestion ) {
        try {
            AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
            String s3Key =
                    s3Key( suggestion.getImprovementState(), suggestion.getRegion(), suggestion.getImprovementId() );
            String suggestionJson = new Gson().toJson( suggestion );
            InputStream jsonStream = IOUtils.toInputStream( suggestionJson, "UTF-8" );
            Long length = (long) suggestionJson.length();
            ObjectMetadata md = new ObjectMetadata();
            md.setContentLength( length );
            s3Client.putObject( new PutObjectRequest( SUGGESTION_BUCKET, s3Key, jsonStream, md ) );
            updateUserInfo( suggestion, suggestion.getCreator(), false );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
    }

    public static void postComment( String improvementState, String region, String improvementId, String userId,
                                    String comment ) {
        ImprovementSuggestion suggestion = getImprovementSuggestion( improvementState, region, improvementId );
        if ( suggestion.getDiscussionList() == null ) {
            suggestion.setDiscussionList( Lists.newArrayList() );
        }
        addComment( suggestion, userId, comment );
        postSuggestion( suggestion );
        updateTopTen( suggestion );
        updateUserInfo( suggestion, userId, true );
    }

    public static String getAllImprovementByRegion( String improvementState, String region ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        final ListObjectsRequest req = new ListObjectsRequest().withBucketName( SUGGESTION_BUCKET )
                                                               .withPrefix( improvementState + "/" + region );
        final ObjectListing listing = s3Client.listObjects( req );
        List<S3ObjectSummary> summaries = listing.getObjectSummaries();
        List<String> instanceNames = summaries.stream()
                                              .filter( item -> item.getKey().contains( "improvementInstance.json" ) )
                                              .map( item -> item.getKey().split( "/" )[2] )
                                              .collect( Collectors.toList() );
        return new Gson().toJson( instanceNames );
    }

    private static void updateTopTen( ImprovementSuggestion suggestion ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( suggestion.getImprovementState(), suggestion.getRegion() );
        String data;
        try {
            S3Object obj = s3Client.getObject( new GetObjectRequest( SUGGESTION_BUCKET, s3Key ) );
            InputStream dataStream = obj.getObjectContent();
            BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
            data = r.lines().collect( Collectors.joining( "\n" ) );
        } catch ( Exception e ) {
            String ranksJson = new Gson().toJson( Lists.newArrayList() );
            try {
                InputStream jsonStream = IOUtils.toInputStream( ranksJson, "UTF-8" );
                Long length = (long) ranksJson.length();
                ObjectMetadata md = new ObjectMetadata();
                md.setContentLength( length );
                s3Client.putObject( new PutObjectRequest( SUGGESTION_BUCKET, s3Key, jsonStream, md ) );
                S3Object obj = s3Client.getObject( new GetObjectRequest( SUGGESTION_BUCKET, s3Key ) );
                InputStream dataStream = obj.getObjectContent();
                BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
                data = r.lines().collect( Collectors.joining( "\n" ) );
            } catch ( Exception e1 ) {
                System.err.println( "error" );
                return;
            }
        }
        Type listType = new TypeToken<List<ImprovementPopularity>>() {}.getType();
        List<ImprovementPopularity> topTenList = new Gson().fromJson( data, listType );
        if ( topTenList == null ) {
            topTenList = Lists.newArrayList();
        }
        int index = -1;
        for ( int i = 0; i < topTenList.size(); i++ ) {
            if ( topTenList.get( i ).getImprovementId().equals( suggestion.getImprovementId() ) ) {
                index = i;
                break;
            }
        }
        int popularity = suggestion.getDiscussionCount() * 2 + suggestion.getUpvotes();
        if ( index == -1 ) {
            if ( topTenList.size() == 10 && popularity > topTenList.get( 9 ).getPopularity() ) {
                topTenList.remove( 9 );
                ImprovementPopularity p = ImprovementPopularity.builder().improvementId( suggestion.getImprovementId() )
                        .popularity( popularity ).region( suggestion.getRegion() ).build();
                topTenList.add( p );
            }
            else if ( topTenList.size() < 10 ) {
                ImprovementPopularity p = ImprovementPopularity.builder().improvementId( suggestion.getImprovementId() )
                                                               .popularity( popularity )
                                                               .region( suggestion.getRegion() ).build();
                topTenList.add( p );
            }
        } else if ( index > 0 && popularity > topTenList.get( index - 1 ).getPopularity() ) {
            topTenList.remove( index );
            ImprovementPopularity p = ImprovementPopularity.builder().improvementId( suggestion.getImprovementId() )
                                                           .popularity( popularity )
                                                           .region( suggestion.getRegion() ).build();
            topTenList.add( index - 1, p );
        } else if ( index >= 0 ) {
            topTenList.remove( index );
            ImprovementPopularity p = ImprovementPopularity.builder().improvementId( suggestion.getImprovementId() )
                                                           .popularity( popularity )
                                                           .region( suggestion.getRegion() ).build();
            topTenList.add( index, p );
        }
        String jsonList = new Gson().toJson( topTenList );
        try {
            InputStream jsonStream = IOUtils.toInputStream( jsonList, "UTF-8" );
            Long length = (long) jsonList.length();
            ObjectMetadata md = new ObjectMetadata();
            md.setContentLength( length );
            s3Client.putObject( new PutObjectRequest( SUGGESTION_BUCKET, s3Key, jsonStream, md ) );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
    }
    private static void updateUserInfo( ImprovementSuggestion suggestion, String userId, Boolean isComment ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( userId );
        S3Object obj;
        try {
            obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        } catch ( Exception e ) {
            createUser( userId, "123456" );
            obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        }
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        UserInfo user = new Gson().fromJson( data, UserInfo.class );
        if ( user.getSuggestions() == null ) {
            user.setSuggestions( Maps.newHashMap() );
        }
        if ( user.getDiscussions() == null ) {
            user.setDiscussions( Maps.newHashMap() );
        }
        if ( isComment ) {
            Map<String, Set<String>> regionMap = user.getDiscussions();
            if ( !user.getDiscussions().containsKey( suggestion.getRegion() ) ) {
                Set<String> suggestionSet = Sets.newHashSet();
                suggestionSet.add( suggestion.getImprovementId() );
                regionMap.put( suggestion.getRegion(), suggestionSet );
                user.setDiscussions( regionMap );
            } else {
                Set<String> suggestionSet = regionMap.get( suggestion.getRegion() );
                suggestionSet.add( suggestion.getImprovementId() );
                regionMap.put( suggestion.getRegion(), suggestionSet );
                user.setDiscussions( regionMap );
            }
        } else {
            Map<String, Set<String>> regionMap = user.getSuggestions();
            if ( !regionMap.containsKey( suggestion.getRegion() ) ) {
                Set<String> suggestionSet = Sets.newHashSet();
                suggestionSet.add( suggestion.getImprovementId() );
                regionMap.put( suggestion.getRegion(), suggestionSet );
                user.setSuggestions( regionMap );
            } else {
                Set<String> suggestionSet = regionMap.get( suggestion.getRegion() );
                suggestionSet.add( suggestion.getImprovementId() );
                regionMap.put( suggestion.getRegion(), suggestionSet );
                user.setSuggestions( regionMap );
            }
        }
        InputStream jsonStream = null;
        String jsonFile = new Gson().toJson( user );
        try {
            jsonStream = IOUtils.toInputStream( jsonFile, "UTF-8" );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
        Long length = (long) jsonFile.length();
        ObjectMetadata md = new ObjectMetadata();
        md.setContentLength( length );
        s3Client.putObject( new PutObjectRequest( USER_INFO_BUCKET, s3Key, jsonStream, md ) );
    }
    public static void updatePassword( String userId, String oldPassword, String newPassword ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( userId );
        S3Object obj;
        try {
        obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        } catch ( Exception e ) {
            createUser( userId, newPassword );
            obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        }
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        UserInfo user = new Gson().fromJson( data, UserInfo.class );
        if ( !oldPassword.equals( user.getPassword() ) ) {
            return;
        }
        user.setPassword( newPassword );
        InputStream jsonStream = null;
        String jsonFile = new Gson().toJson( user );
        try {
            jsonStream = IOUtils.toInputStream( jsonFile, "UTF-8" );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
        Long length = (long) jsonFile.length();
        ObjectMetadata md = new ObjectMetadata();
        md.setContentLength( length );
        s3Client.putObject( new PutObjectRequest( USER_INFO_BUCKET, s3Key, jsonStream, md ) );
    }
    public static void createUser( String userId, String password ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( userId );
        UserInfo newUser = UserInfo.builder().userId( userId ).discussions( Maps.newHashMap() )
                .suggestions( Maps.newHashMap() ).password( password ).build();
        String jsonFile = new Gson().toJson( newUser );
        InputStream jsonStream = new InputStream() {
            @Override
            public int read() throws IOException {
                return 0;
            }
        };
        try {
            jsonStream = IOUtils.toInputStream( jsonFile, "UTF-8" );
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
        Long length = (long) jsonFile.length();
        ObjectMetadata md = new ObjectMetadata();
        md.setContentLength( length );
        s3Client.putObject( new PutObjectRequest( USER_INFO_BUCKET, s3Key, jsonStream, md ) );
    }
    public static String getUserInfoFromRequest( String userId ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( userId );
        S3Object obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        return r.lines().collect( Collectors.joining( "\n" ) );
    }
    public static String getTopTenImprovements( String region ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( "ONGOING", region );
        S3Object obj;
        try {
            obj = s3Client.getObject( new GetObjectRequest( SUGGESTION_BUCKET, s3Key ) );
        } catch ( Exception e ) {
            System.err.println( "error" );
            return null;
        }
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        try {
            obj.close();
        } catch ( Exception e ) {
            System.out.println( "IOException" );
            return null;
        }
        return data;
    }
    private static String s3Key( String improvementState, String region ) {
        return improvementState +
               "/" +
               region + "/topTenImprovements.json";
    }
    private static String s3Key( String userId ) {
        return userId + "/userInfo.json";
    }
    public static String login( String userId, String password ) {
        LoginStatus status = new LoginStatus( false );
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( userId );
        S3Object obj;
        try {
            obj = s3Client.getObject( new GetObjectRequest( USER_INFO_BUCKET, s3Key ) );
        } catch ( Exception e ) {
            return new Gson().toJson( status );
        }
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        UserInfo user = new Gson().fromJson( data, UserInfo.class );
        if ( password.equals( user.getPassword() ) ) {
            status.setLoginStatus( true );
        }
        return new Gson().toJson( status );
    }
}
