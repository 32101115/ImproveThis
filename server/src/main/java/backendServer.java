import static spark.Spark.get;

public class backendServer {
    public static void main( String[] args ) {
        get( "/getImprovement/*", ( req, res ) -> {
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
            Double yPosition = Double.valueOf( req.queryParams( "yPosition" ) );
            String creator = req.queryParams( "creator" );
            ImproveThisUtils.postImprovement( region,improvementId, xPosition, yPosition, title, description, creator );
            return ImproveThisUtils.getImprovementFromRequest( "ONGOING", region, improvementId );
        } );
        get( "/upvote/*", ( req, res ) -> {
            String region = req.queryParams( "region" );
            String improvementId = req.queryParams( "improvementId" );
            ImproveThisUtils.upvote( "ONGOING", region, improvementId );
            return ImproveThisUtils.getImprovementFromRequest( "ONGOING", region, improvementId );
        } );
        get( "/postComment/*", ( req, res ) -> {
            String region = req.queryParams( "region" );
            String comment = req.queryParams( "comment" );
            String improvementId = req.queryParams( "improvementId" );
            String userId = req.queryParams( "userId" );
            ImproveThisUtils.postComment( "ONGOING", region, improvementId, userId, comment );
            return ImproveThisUtils.getImprovementFromRequest( "ONGOING", region, improvementId );
        } );
    }
}
