package mmi.sae.appsae.config;

import mmi.sae.appsae.model.AdminUser;
import mmi.sae.appsae.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminUserInitializer {

    @Value("${app.admin.initial-password:admin}")
    private String initialPassword;

    /**
     * Crée le compte {@code admin} s'il n'existe pas (y compris si d'autres lignes
     * sont déjà présentes — l'ancien test {@code count() == 0} empêchait alors toute création).
     */
    @Bean
    public CommandLineRunner initAdminUser(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        return applicationArguments -> {
            if (adminUserRepository.findByUsername("admin").isEmpty()) {
                AdminUser adminUser = new AdminUser();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode(initialPassword));
                adminUserRepository.save(adminUser);
            }
        };
    }
}
