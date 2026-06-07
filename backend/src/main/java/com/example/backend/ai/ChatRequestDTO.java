package com.example.backend.ai;

import lombok.Data;

@Data
public class ChatRequestDTO {
    private Long userId;
    private String message;
}
