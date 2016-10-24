import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImprovementSuggestion {
    private String improvementState;
    private String region;
    private String improvementId;
    private Double xPosition;
    private Double yPosition;
    private String creator;
    private String creationDate;
    private Integer upvotes;
    private String title;
    private String description;
    private List<String> pictureList;
    private Integer discussionCount;
    private List<ImprovementDiscussion> discussionList;


    public String s3Key() {
        return ImproveThisUtils.s3Key( improvementState, region, improvementId );
    }
}
