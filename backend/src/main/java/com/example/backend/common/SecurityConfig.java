package com.example.backend.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF cho REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/health").permitAll() // Cho phép truy cập API Health Check không cần login
                .anyRequest().permitAll() // Tạm thời cho phép tất cả các request khác (để code cho dễ)
            )
            .formLogin(AbstractHttpConfigurer::disable) // Tắt form login mặc định của Spring
            .httpBasic(AbstractHttpConfigurer::disable); // Tắt HTTP Basic Auth

        return http.build();
    }
}
