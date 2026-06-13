package com.example.backend.auth.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank
    private String token;

    @NotBlank
    private String newPassword;
}
