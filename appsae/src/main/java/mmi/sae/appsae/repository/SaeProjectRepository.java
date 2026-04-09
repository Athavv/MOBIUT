package mmi.sae.appsae.repository;

import mmi.sae.appsae.model.SaeProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaeProjectRepository extends JpaRepository<SaeProject, Long> {
    List<SaeProject> findBySaeId(Long saeId);
    List<SaeProject> findByGroupeYear(String year);
    List<SaeProject> findBySaeDomain(String domain);
}
