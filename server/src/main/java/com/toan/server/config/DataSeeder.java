package com.toan.server.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.toan.server.entity.Department;
import com.toan.server.entity.DocumentCategory;
import com.toan.server.entity.User;
import com.toan.server.enums.Role;
import com.toan.server.repository.DepartmentRepository;
import com.toan.server.repository.DocumentCategoryRepository;
import com.toan.server.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DocumentCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      DepartmentRepository departmentRepository,
                      DocumentCategoryRepository categoryRepository, 
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Department dept = departmentRepository.findByName("Phòng Hành chính")
                .orElseGet(() -> {
                    Department newDept = new Department();
                    newDept.setName("Phòng Hành chính");
                    return departmentRepository.save(newDept);
                });

        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullname("Quản trị viên");
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setDepartment(dept);
            userRepository.save(admin);
        }

        categoryRepository.findByName("Luật")
                .orElseGet(() -> {
                    DocumentCategory cat = new DocumentCategory();
                    cat.setName("Luật");
                    cat.setDescription("Các văn bản luật");
                    return categoryRepository.save(cat);
                });
    }
}
