import org.junit.Test;

/**
 * Created by fengy on 10/18/2016.
 */
public class apiTest {
    @Test
    public void testGetImprovement() {
        ImprovementSuggestion sug = ImproveThisUtils.getImprovementSuggestion( "ONGOING", "CoC", "1" );
        System.out.println( sug.toString() );
    }

    @Test
    public void testUpvote(){
        ImproveThisUtils.upvote( "ONGOING", "CoC", "1" );
        ImprovementSuggestion sug = ImproveThisUtils.getImprovementSuggestion( "ONGOING", "CoC", "1" );
        System.out.println( sug.toString() );
    }

    @Test
    public void testPostComment(){
        ImproveThisUtils.postComment( "ONGOING", "CoC", "1", "qkorner3", "This is a good idea" );
        ImprovementSuggestion sug = ImproveThisUtils.getImprovementSuggestion( "ONGOING", "CoC", "1" );
        System.out.println( sug.toString() );
    }

    @Test
    public void testLogin() {
        ImproveThisUtils.login( "qkorner34", "1234567" );
    }
}
