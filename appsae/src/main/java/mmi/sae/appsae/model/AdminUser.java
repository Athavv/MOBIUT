package mmi.sae.appsae.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_users")
@Getter @Setter @NoArgsConstructor
public class AdminUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
}
