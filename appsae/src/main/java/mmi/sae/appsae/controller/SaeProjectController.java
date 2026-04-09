package mmi.sae.appsae.controller;

import mmi.sae.appsae.model.Groupe;
import mmi.sae.appsae.model.Sae;
import mmi.sae.appsae.model.SaeProject;
import mmi.sae.appsae.repository.GroupeRepository;
import mmi.sae.appsae.repository.SaeProjectRepository;
import mmi.sae.appsae.repository.SaeRepository;
import mmi.sae.appsae.dto.SaeProjectRequest;
import mmi.sae.appsae.dto.SaeProjectResponse;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/sae-project")
public class SaeProjectController {
    private final SaeProjectRepository saeProjectRepository;
    private final SaeRepository saeRepository;
    private final GroupeRepository groupeRepository;

    public SaeProjectController(SaeProjectRepository saeProjectRepository,
                                SaeRepository saeRepository,
                                GroupeRepository groupeRepository) {
        this.saeProjectRepository = saeProjectRepository;
        this.saeRepository = saeRepository;
        this.groupeRepository = groupeRepository;
    }

    @GetMapping("/public/by-year")
    public List<SaeProjectResponse> findByYear(@RequestParam String year) {
        return saeProjectRepository.findByGroupeYear(year)
            .stream().map(SaeProjectResponse::from).toList();
    }

    @GetMapping("/public/by-domain")
    public List<SaeProjectResponse> findByDomain(@RequestParam String domain) {
        return saeProjectRepository.findBySaeDomain(domain)
            .stream().map(SaeProjectResponse::from).toList();
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<SaeProjectResponse> findById(@PathVariable Long id) {
        return saeProjectRepository.findById(id)
            .map(SaeProjectResponse::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<SaeProjectResponse> create(@RequestBody SaeProjectRequest request) {
        Sae sae = saeRepository.findById(request.getSaeId()).orElseThrow();
        Groupe groupe = groupeRepository.findById(request.getGroupeId()).orElseThrow();

        SaeProject project = new SaeProject();
        project.setSae(sae);
        project.setGroupe(groupe);
        project.setImageUrls(Objects.requireNonNullElse(request.getImageUrls(), List.of()));
        project.setHumanResources(request.getHumanResources());
        project.setWebsiteUrl(request.getWebsiteUrl());
        project.setSourceCodeUrl(request.getSourceCodeUrl());
        project.setStudentGrades(Objects.requireNonNullElse(request.getStudentGrades(), List.of()));

        return ResponseEntity.ok(SaeProjectResponse.from(saeProjectRepository.save(project)));
    }
}
