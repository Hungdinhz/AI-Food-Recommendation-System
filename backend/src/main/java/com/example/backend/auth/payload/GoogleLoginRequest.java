package com.example.backend.auth.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    @NotBlank
    private String token; // Google ID Token
}
