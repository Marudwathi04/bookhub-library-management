package com.bookhub.bookhub_backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookhub.bookhub_backend.model.User;
import com.bookhub.bookhub_backend.repository.UserRepository;
import com.bookhub.bookhub_backend.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String registerUser(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            return "Email already exists!";
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = User.builder()
                .username(username)
                .email(email)
                .password(encodedPassword)
                .role("USER") // default role
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    public Map<String, String> loginUser(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        Map<String, String> response = new HashMap<>();

        if (optionalUser.isEmpty()) {
            response.put("message", "User not found!");
            return response;
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("message", "Invalid password!");
            return response;
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        response.put("message", "Login successful!");
        response.put("token", token);
        response.put("role", user.getRole());

        return response;
    }
}
