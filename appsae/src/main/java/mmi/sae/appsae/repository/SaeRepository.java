package mmi.sae.appsae.repository;

import mmi.sae.appsae.model.Sae;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaeRepository extends JpaRepository<Sae, Long> {
    List<Sae> findByDomain(String domain);
    List<Sae> findBySemester(String semester);
}
