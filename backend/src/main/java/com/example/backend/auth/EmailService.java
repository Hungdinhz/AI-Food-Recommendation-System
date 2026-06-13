package com.example.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    // In a real application, you would use JavaMailSender
    // private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetUrl) {
        // Mock implementation for development
        logger.info("==========================================================");
        logger.info("MOCK EMAIL SENDER");
        logger.info("To: {}", to);
        logger.info("Subject: Reset Your Password");
        logger.info("Body: Click the link to reset your password: {}", resetUrl);
        logger.info("==========================================================");
    }
}
