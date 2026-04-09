package mmi.sae.appsae.dto;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor
public class SaeProjectRequest {
    private Long saeId;
    private Long groupeId;
    private List<String> imageUrls;
    private String humanResources;
    private String websiteUrl;
    private String sourceCodeUrl;
    private List<Double> studentGrades;
}
