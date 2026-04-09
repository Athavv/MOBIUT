package mmi.sae.appsae.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "sae_projects")
@Getter @Setter @NoArgsConstructor
public class SaeProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sae_id", nullable = false)
    private Sae sae;

    @ManyToOne
    @JoinColumn(name = "groupe_id", nullable = false)
    private Groupe groupe;

    @ElementCollection
    @CollectionTable(name = "sae_project_images", joinColumns = @JoinColumn(name = "sae_project_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    private String humanResources;
    private String websiteUrl;
    private String sourceCodeUrl;

    @ElementCollection
    @CollectionTable(name = "sae_project_grades", joinColumns = @JoinColumn(name = "sae_project_id"))
    @Column(name = "grade")
    private List<Double> studentGrades;
}
