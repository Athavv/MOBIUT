package mmi.sae.appsae.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import mmi.sae.appsae.model.Groupe;
import mmi.sae.appsae.model.Sae;
import mmi.sae.appsae.model.SaeProject;
import mmi.sae.appsae.model.Ue;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO JSON uniquement (pas d'entités JPA) pour éviter LazyInitializationException
 * et cycles à la sérialisation.
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SaeProjectResponse {
    private final Long id;
    private final SaeJson sae;
    private final GroupeJson groupe;
    private final List<String> imageUrls;
    private final String humanResources;
    private final String websiteUrl;
    private final String sourceCodeUrl;
    private final List<Double> studentGrades;
    private final double average;
    private final double min;
    private final double max;

    public SaeProjectResponse(
            Long id,
            SaeJson sae,
            GroupeJson groupe,
            List<String> imageUrls,
            String humanResources,
            String websiteUrl,
            String sourceCodeUrl,
            List<Double> studentGrades,
            double average,
            double min,
            double max
    ) {
        this.id = id;
        this.sae = sae;
        this.groupe = groupe;
        this.imageUrls = imageUrls;
        this.humanResources = humanResources;
        this.websiteUrl = websiteUrl;
        this.sourceCodeUrl = sourceCodeUrl;
        this.studentGrades = studentGrades;
        this.average = average;
        this.min = min;
        this.max = max;
    }

    public static SaeProjectResponse from(SaeProject p) {
        List<Double> grades = p.getStudentGrades() != null ? p.getStudentGrades() : List.of();
        double avg = grades.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double minG = grades.stream().mapToDouble(Double::doubleValue).min().orElse(0.0);
        double maxG = grades.stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        return new SaeProjectResponse(
                p.getId(),
                SaeJson.from(p.getSae()),
                GroupeJson.from(p.getGroupe()),
                p.getImageUrls() != null ? p.getImageUrls() : List.of(),
                p.getHumanResources(),
                p.getWebsiteUrl(),
                p.getSourceCodeUrl(),
                grades,
                avg,
                minG,
                maxG
        );
    }

    @Getter
    public static class SaeJson {
        private final Long id;
        private final String title;
        private final String description;
        private final String domain;
        private final String semester;
        private final LocalDate startDate;
        private final LocalDate endDate;
        private final UeJson ue;

        public SaeJson(Long id, String title, String description, String domain, String semester,
                       LocalDate startDate, LocalDate endDate, UeJson ue) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.domain = domain;
            this.semester = semester;
            this.startDate = startDate;
            this.endDate = endDate;
            this.ue = ue;
        }

        static SaeJson from(Sae s) {
            Ue u = s.getUe();
            UeJson ueJson = u == null ? null : new UeJson(u.getId(), u.getCode(), u.getName());
            return new SaeJson(
                    s.getId(),
                    s.getTitle(),
                    s.getDescription(),
                    s.getDomain(),
                    s.getSemester(),
                    s.getStartDate(),
                    s.getEndDate(),
                    ueJson
            );
        }
    }

    @Getter
    public static class UeJson {
        private final Long id;
        private final String code;
        private final String name;

        public UeJson(Long id, String code, String name) {
            this.id = id;
            this.code = code;
            this.name = name;
        }
    }

    @Getter
    public static class GroupeJson {
        private final Long id;
        private final String name;
        private final String year;

        public GroupeJson(Long id, String name, String year) {
            this.id = id;
            this.name = name;
            this.year = year;
        }

        static GroupeJson from(Groupe g) {
            return new GroupeJson(g.getId(), g.getName(), g.getYear());
        }
    }
}
