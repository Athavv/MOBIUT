package mmi.sae.appsae.controller;

import mmi.sae.appsae.model.Ue;
import mmi.sae.appsae.repository.UeRepository;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ue")
public class UeController {
    private final UeRepository ueRepository;

    public UeController(UeRepository ueRepository) {
        this.ueRepository = ueRepository;
    }

    @GetMapping("/public/all")
    public List<Ue> findAll() {
        return ueRepository.findAll();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<Ue> create(@RequestBody Ue ue) {
        return ResponseEntity.ok(ueRepository.save(ue));
    }
}
