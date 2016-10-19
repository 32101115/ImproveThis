import static spark.Spark.get;

/**
 * Created by fengy on 10/19/2016.
 */
public class backendServer {
    public static void main( String[] args ) {
        get( "/getImprovement/*/*/*", ( req, res ) -> {
            return ImproveThisUtils.getImprovementSuggestion( req.splat()[0], req.splat()[1], req.splat()[2] ).toString();
        } );
    }
}
