package com.toan.server.service;

import com.toan.server.dto.request.LoginRequest;
import com.toan.server.dto.request.RegisterRequest;
import com.toan.server.dto.response.LoginResponse;
import com.toan.server.entity.AuditLog;
import com.toan.server.entity.User;
import com.toan.server.enums.AuditAction;
import com.toan.server.enums.Role;
import com.toan.server.repository.AuditLogRepository;
import com.toan.server.repository.UserRepository;
import com.toan.server.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, AuditLogRepository auditLogRepository,
                       PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác!"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("Tài khoản đã bị khóa, vui lòng liên hệ admin");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác!");
        }

        String token = tokenProvider.generateToken(user);
        return new LoginResponse(token, user.getEmail(), user.getFullname(), user.getRole().name());
    }

    public String registerUser(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không trùng khớp!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email này đã được dùng bởi tài khoản khác!");
        }

        String baseUsername = registerRequest.getEmail().split("@")[0];
        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        User user = new User();

        user.setFullname(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); 
        user.setRole(Role.USER);                                          
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        AuditLog auditLog = new AuditLog();
        auditLog.setAction(AuditAction.REGISTER);
        auditLog.setCreatedAt(LocalDateTime.now());
        auditLog.setUser(savedUser);
        auditLogRepository.save(auditLog);

        return "Đăng ký tài khoản thành công!";
    }
}
