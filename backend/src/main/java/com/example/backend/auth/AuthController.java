package com.example.backend.auth;

import com.example.backend.auth.payload.*;
import com.example.backend.security.JwtUtils;
import com.example.backend.security.UserDetailsImpl;
import com.example.backend.users.AuthProvider;
import com.example.backend.users.User;
import com.example.backend.users.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder encoder, JwtUtils jwtUtils, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.emailService = emailService;
    }

    // Use a generic verifier for now or provide your client ID
    private final GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
            // .setAudience(Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
            .build();

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .provider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            // Verify Google Token
            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // Check if user exists
                Optional<User> userOptional = userRepository.findByEmail(email);
                User user;
                if (userOptional.isPresent()) {
                    user = userOptional.get();
                    // Update name or provider if needed, but usually we just log them in
                } else {
                    // Register new Google user
                    user = User.builder()
                            .email(email)
                            .name(name)
                            .provider(AuthProvider.GOOGLE)
                            .password(encoder.encode(UUID.randomUUID().toString())) // Random password
                            .build();
                    userRepository.save(user);
                }

                String jwt = jwtUtils.generateTokenFromEmail(user.getEmail());
                return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), user.getName()));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid Google token."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error verifying Google token: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.ok(new MessageResponse("If that email is in our database, we will send a reset link.")); // Generic message for security
        }

        User user = userOptional.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        userRepository.save(user);

        String resetUrl = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);

        return ResponseEntity.ok(new MessageResponse("If that email is in our database, we will send a reset link."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByResetPasswordToken(request.getToken());
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid reset token."));
        }

        User user = userOptional.get();
        if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Reset token has expired."));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
    }
}
