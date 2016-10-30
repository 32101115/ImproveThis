import static spark.Spark.get;

public class backendServer {
    public static void main( String[] args ) {
        get( "/getImprovement/", ( req, res ) -> {
            String region = req.queryParams( "region" );
            String improvementState = req.queryParams( "improvementState" );
            String improvementId = req.queryParams( "improvementId" );
            return ImproveThisUtils.getImprovementFromRequest( improvementState, region, improvementId );
        } );
        get( "/postImprovement/*", ( req, res ) -> {
            String region = req.queryParams( "region" );
            String description = req.queryParams( "description" );
            String improvementId = req.queryParams( "improvementId" );
            String title = req.queryParams( "title" );
            Double xPosition = Double.valueOf( req.queryParams( "xPosition" ) );
            Double yPosition = Double.valueOf( req.queryParams( "xPosition" ) );
            String creator = req.queryParams( "creator" );
            return ImproveThisUtils.getImprovementFromRequest( "ONGOING", region, improvementId );
        } );
        get( "/upvote/*/*/*", ( req, res ) -> {
            ImproveThisUtils.upvote( req.splat()[0], req.splat()[1], req.splat()[2] );
            return ImproveThisUtils.getImprovementSuggestion( req.splat()[0], req.splat()[1], req.splat()[2] ).toString();
        } );
    }
}
