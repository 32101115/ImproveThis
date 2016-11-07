import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.io.IOUtils;
import org.joda.time.DateTime;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
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
        JsonParser parser = new JsonParser();
        JsonObject jsonData = parser.parse( data ).getAsJsonObject();
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
        } catch ( IOException e ) {
            System.err.println( "error" );
        }
    }

    public static void postImprovement( String region, String improvementId, Double xPosition, Double yPosition,
                                        String title, String description, String creator ) {
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
                                                                .build();
        postSuggestion( suggestion );
    }

    public static String getImprovementFromRequest( String improvementState, String region, String improvementId ) {
        ImprovementSuggestion suggestion = getImprovementSuggestion( improvementState, region, improvementId );
        Gson gson = new Gson();
        String outputJson = gson.toJson( suggestion );
        return outputJson;
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
}
