package mmi.sae.appsae.controller;

import mmi.sae.appsae.model.Groupe;
import mmi.sae.appsae.repository.GroupeRepository;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groupe")
public class GroupeController {
    private final GroupeRepository groupeRepository;

    public GroupeController(GroupeRepository groupeRepository) {
        this.groupeRepository = groupeRepository;
    }

    @GetMapping("/public/all")
    public List<Groupe> findAll() {
        return groupeRepository.findAll();
    }

    @GetMapping("/public/by-year")
    public List<Groupe> findByYear(@RequestParam String year) {
        return groupeRepository.findByYear(year);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<Groupe> create(@RequestBody Groupe groupe) {
        return ResponseEntity.ok(groupeRepository.save(groupe));
    }
}
