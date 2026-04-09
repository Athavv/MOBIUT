package mmi.sae.appsae.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "saes")
@Getter @Setter @NoArgsConstructor
public class Sae {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, length = 2000)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String domain;

    @NotBlank
    @Column(nullable = false)
    private String semester;

    @NotNull
    @Column(nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(nullable = false)
    private LocalDate endDate;

    @Column
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "ue_id")
    private Ue ue;
}
