package com.bookhub.bookhub_backend.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    // ✅ Must be at least 256 bits (32 characters)
    private final String SECRET_KEY = "MySuperStrongKey_2025@BookHub#JWT123_SecretKey_32Bytes!!";
    
    // ✅ Create SecretKey object for signing
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // ✅ Generate JWT Token with email and role
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(getSigningKey())
                .compact();
    }

    // ✅ Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Extract role from token
    public String extractRole(String token) {
        Object r = extractAllClaims(token).get("role");
        return r == null ? null : r.toString();
    }

    // ✅ Extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Validate token
    public boolean isTokenValid(String token, String email) {
        try {
            return email != null && email.equals(extractEmail(token)) && !isTokenExpired(token);
        } catch (Exception ex) {
            System.err.println("❌ Token validation failed: " + ex.getMessage());
            return false;
        }
    }

    // ✅ Check if token is expired
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}