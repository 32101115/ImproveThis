import static spark.Spark.get;

public class backendServer {
    public static void main( String[] args ) {
        get( "/getImprovement/*/*/*", ( req, res ) -> {
            return ImproveThisUtils.getImprovementSuggestion( req.splat()[0], req.splat()[1], req.splat()[2] ).toString();
        } );
        get( "/upvote/*/*/*", ( req, res ) -> {
            ImproveThisUtils.upvote( req.splat()[0], req.splat()[1], req.splat()[2] );
            return ImproveThisUtils.getImprovementSuggestion( req.splat()[0], req.splat()[1], req.splat()[2] ).toString();
        } );
    }
}
