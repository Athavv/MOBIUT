package mmi.sae.appsae.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "ues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Ue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String name;
}
