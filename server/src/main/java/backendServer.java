import static spark.Spark.*;

public class BackendServer {
    private static void enableCORS( final String origin, final String methods, final String headers ) {

        options( "/*", ( request, response ) -> {

            String accessControlRequestHeaders = request.headers( "Access-Control-Request-Headers" );
            if ( accessControlRequestHeaders != null ) {
                response.header( "Access-Control-Allow-Headers", accessControlRequestHeaders );
            }

            String accessControlRequestMethod = request.headers( "Access-Control-Request-Method" );
            if ( accessControlRequestMethod != null ) {
                response.header( "Access-Control-Allow-Methods", accessControlRequestMethod );
            }

            return "OK";
        } );

        before( ( request, response ) -> {
            response.header( "Access-Control-Allow-Origin", origin );
            response.header( "Access-Control-Request-Method", methods );
            response.header( "Access-Control-Allow-Headers", headers );
            // Note: this may or may not be necessary in your particular application
            response.type( "application/json" );
        } );
    }

    public static void main( String[] args ) {
        enableCORS( "*", "*", "*" );
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
            String location = req.queryParams( "location" );
            ImproveThisUtils
                    .postImprovement( region, improvementId, xPosition, yPosition, title, description, creator,
                                      location );
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
        get( "/getImprovementNames/*", ( req, res ) -> {
            String region = req.queryParams( "region" );
            return ImproveThisUtils.getAllImprovementByRegion( "ONGOING", region );
        } );
        get( "/getTopTenImprovements/*", ( req, res ) -> {
            String region = req.queryParams( "region" );
            return ImproveThisUtils.getTopTenImprovements( region );
        } );

        get( "/updatePassword/*", ( req, res ) -> {
            String oldPassword = req.queryParams( "oldPassword" );
            String userId = req.queryParams( "userId" );
            String newPassword = req.queryParams( "newPassword" );
            ImproveThisUtils.updatePassword( userId, oldPassword, newPassword );
            return ImproveThisUtils.getUserInfoFromRequest( userId );
        } );
        get( "/getUserInfo/*", ( req, res ) -> ImproveThisUtils
                .getUserInfoFromRequest( req.queryParams( "userId" ) ) );
        get( "/login/*", ( req, res ) -> ImproveThisUtils
                .login( req.queryParams( "userId" ), req.queryParams( "password" ) ) );
        get( "/createUser/*", ( req, res ) -> {
            String userId = req.queryParams( "userId" );
            String password = req.queryParams( "password" );
            ImproveThisUtils.createUser( userId, password );
            return ImproveThisUtils.getUserInfoFromRequest( userId );
        } );
    }
}
