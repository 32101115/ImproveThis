import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImprovementPopularity {
    private String region;
    private String improvementId;
    private Integer popularity;
}
