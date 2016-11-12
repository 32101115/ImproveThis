import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo {
    private String userId;
    private Map<String, List<String>> suggestions;
    private Map<String, List<String>> discussions;
}
