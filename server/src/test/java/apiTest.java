import org.junit.Test;

/**
 * Created by fengy on 10/18/2016.
 */
public class apiTest {
    @Test
    public void test() {
        ImprovementSuggestion sug = ImproveThisUtils.getImprovementSuggestion( "ONGOING", "CoC", "1" );
        System.out.println( sug.toString() );
    }
}
