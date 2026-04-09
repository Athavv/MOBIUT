package mmi.sae.appsae.controller;

import jakarta.validation.Valid;
import mmi.sae.appsae.model.Sae;
import mmi.sae.appsae.repository.SaeProjectRepository;
import mmi.sae.appsae.repository.SaeRepository;
import mmi.sae.appsae.repository.UeRepository;
import mmi.sae.appsae.dto.SaeProjectResponse;
import mmi.sae.appsae.dto.SaeRequest;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sae")
public class SaeController {
    private final SaeRepository saeRepository;
    private final UeRepository ueRepository;
    private final SaeProjectRepository saeProjectRepository;

    public SaeController(SaeRepository saeRepository, UeRepository ueRepository,
                         SaeProjectRepository saeProjectRepository) {
        this.saeRepository = saeRepository;
        this.ueRepository = ueRepository;
        this.saeProjectRepository = saeProjectRepository;
    }

    @GetMapping("/public/all")
    public List<Sae> findAll() {
        return saeRepository.findAll();
    }

    @GetMapping("/public/by-domain")
    public List<Sae> findByDomain(@RequestParam String domain) {
        return saeRepository.findByDomain(domain);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Sae> findById(@PathVariable Long id) {
        return saeRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/{id}/projects")
    public List<SaeProjectResponse> findProjects(@PathVariable Long id) {
        return saeProjectRepository.findBySaeId(id)
            .stream()
            .map(SaeProjectResponse::from)
            .toList();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<Sae> create(@Valid @RequestBody SaeRequest request) {
        Sae sae = new Sae();
        sae.setTitle(request.getTitle());
        sae.setDescription(request.getDescription());
        sae.setDomain(request.getDomain());
        sae.setSemester(request.getSemester());
        sae.setStartDate(request.getStartDate());
        sae.setEndDate(request.getEndDate());
        sae.setImageUrl(request.getImageUrl());
        if (request.getUeId() != null) {
            ueRepository.findById(request.getUeId()).ifPresent(sae::setUe);
        }
        return ResponseEntity.ok(saeRepository.save(sae));
    }
}
