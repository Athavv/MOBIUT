package mmi.sae.appsae.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor
public class SaeRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String domain;

    @NotBlank
    private String semester;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private Long ueId;

    private String imageUrl;
}
