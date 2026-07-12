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
                .orElseThrow(() -> new RuntimeException("Email hoáº·c máº­t kháº©u khÃ´ng chÃ­nh xÃ¡c!"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new RuntimeException("T\u00e0i kho\u1ea3n \u0111\u00e3 b\u1ecb kh\u00f3a, vui l\u00f2ng li\u00ean h\u1ec7 admin");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoáº·c máº­t kháº©u khÃ´ng chÃ­nh xÃ¡c!");
        }

        String token = tokenProvider.generateToken(user);
        return new LoginResponse(token, user.getEmail(), user.getFullname(), user.getRole().name());
    }

    public String registerUser(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Máº­t kháº©u xÃ¡c nháº­n khÃ´ng trÃ¹ng khá»›p!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email nÃ y Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng bá»Ÿi má»™t tÃ i khoáº£n khÃ¡c!");
        }

        String baseUsername = registerRequest.getEmail().split("@")[0];
        String username = baseUsername;
        int counter = 1;
        // VÃ²ng láº·p phÃ²ng trÆ°á»ng há»£p hai email trÃ¹ng tiá»n tá»‘ trÆ°á»›c @
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

        return "ÄÄƒng kÃ½ tÃ i khoáº£n thÃ nh cÃ´ng!";
    }
}
