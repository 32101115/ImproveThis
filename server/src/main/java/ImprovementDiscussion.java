import lombok.Data;

import java.util.List;

@Data
public class ImprovementDiscussion {
    private Integer sequenceId;
    private String userId;
    private String contents;
    private List<String> pictureList;
}
