import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.google.gson.*;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

public class ImproveThisUtils {
    private static final String USER_INFO_BUCKET = "user.info";
    private static final String SUGGESTION_BUCKET = "improvement.suggestions";

    public static String s3Key( String improvementState, String region, String improvementId ) {
        StringBuilder sb = new StringBuilder( 100 );

        sb.append( improvementState );
        sb.append( "/" );
        sb.append( region );
        sb.append( "/" );
        sb.append( improvementId );
        sb.append( "/improvementInstance.json" );

        return sb.toString();
    }

    public static ImprovementSuggestion getImprovementSuggestion( String improvementState, String region, String improvementId ) {
        AmazonS3 s3Client = new AmazonS3Client( new ProfileCredentialsProvider() );
        String s3Key = s3Key( improvementState, region, improvementId );
        System.out.println( s3Key );
        S3Object obj = s3Client.getObject( new GetObjectRequest( SUGGESTION_BUCKET, s3Key ) );
        InputStream dataStream = obj.getObjectContent();
        BufferedReader r = new BufferedReader( new InputStreamReader( dataStream ) );
        String data = r.lines().collect( Collectors.joining( "\n" ) );
        System.out.println( data );
        try {
            obj.close();
        } catch ( Exception e ) {
            System.out.println( "IOException" );
            return null;
        }
        JsonParser parser = new JsonParser();
        JsonObject jsonData = parser.parse( data ).getAsJsonObject();
        ImprovementSuggestion suggestion = new Gson().fromJson( data, ImprovementSuggestion.class );
        return suggestion;
    }
}
