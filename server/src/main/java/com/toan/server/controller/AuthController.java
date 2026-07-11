package com.toan.server.controller;

import com.toan.server.dto.request.LoginRequest;
import com.toan.server.dto.request.RegisterRequest;
import com.toan.server.dto.response.LoginResponse;
import com.toan.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
        public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
            try {
                String result = authService.registerUser(registerRequest);
                // Trả về thông báo thành công dưới dạng JSON object đơn giản
                return ResponseEntity.ok().body(java.util.Map.of("message", result));
            } catch (RuntimeException e) {
                // Trả về lỗi định dạng 400 và nội dung thông báo lỗi để hiển thị lên UI Frontend
                return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
            }
        }
}