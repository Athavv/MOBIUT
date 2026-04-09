package mmi.sae.appsae.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/public/images")
public class ImageController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam(value = "file", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier manquant ou vide");
        }
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String originalFilename = StringUtils.cleanPath(
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg");
            String extension = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String newFilename = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(newFilename)
                    .toUriString();

            return ResponseEntity.ok(fileUrl);
        } catch (IOException ioException) {
            return ResponseEntity.internalServerError().body("Could not upload image: " + ioException.getMessage());
        }
    }
}
