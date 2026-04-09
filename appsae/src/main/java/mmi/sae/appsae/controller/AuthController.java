package mmi.sae.appsae.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import mmi.sae.appsae.dto.AuthRequest;
import mmi.sae.appsae.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.secret:AppSAEsecretKeyForJWTtokenGenerationMMI3IUTMLVMeaux2026}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-milliseconds:86400000}")
    private long jwtExpirationInMs;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        String username = authRequest.getUsername() != null ? authRequest.getUsername().trim() : "";
        String password = authRequest.getPassword() != null ? authRequest.getPassword().trim() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        String token = Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
                .compact();

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
