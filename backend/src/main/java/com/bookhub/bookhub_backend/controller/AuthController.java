package com.bookhub.bookhub_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookhub.bookhub_backend.model.User;
import com.bookhub.bookhub_backend.repository.UserRepository;
import com.bookhub.bookhub_backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register New User
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String email = userData.get("email");
            String password = userData.get("password");

            // Validation
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username is required!"));
            }

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required!"));
            }

            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password must be at least 6 characters!"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists!"));
            }

            // Create new user with USER role by default
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role("USER") // Default role
                    .build();

            userRepository.save(user);

            System.out.println("✅ User registered successfully: " + email);

            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));

        } catch (Exception e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Registration failed. Please try again."));
        }
    }

    // ✅ Login User
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");

            // Validation
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required!"));
            }

            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required!"));
            }

            // Find user by email
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found!"));
            }

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid password!"));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            // Prepare response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("email", user.getEmail());
            response.put("username", user.getUsername());

            System.out.println("✅ User logged in: " + email + " | Role: " + user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Login failed. Please try again."));
        }
    }
}