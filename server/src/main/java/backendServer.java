import static spark.Spark.get;

public class backendServer {
    public static void main( String[] args ) {
        get( "/getImprovement/*/*/*", ( req, res ) -> {
            try {
                return ImproveThisUtils.getImprovementSuggestion(req.splat()[0], req.splat()[1], req.splat()[2]).toString();
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        } );
        get( "/upvote/*/*/*", ( req, res ) -> {
            ImproveThisUtils.upvote( req.splat()[0], req.splat()[1], req.splat()[2] );
            return ImproveThisUtils.getImprovementSuggestion( req.splat()[0], req.splat()[1], req.splat()[2] ).toString();
        } );
    }
}
