package mmi.sae.appsae.repository;

import mmi.sae.appsae.model.Groupe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupeRepository extends JpaRepository<Groupe, Long> {
    List<Groupe> findByYear(String year);
}
