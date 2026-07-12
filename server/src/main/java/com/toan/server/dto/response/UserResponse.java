package com.toan.server.dto.response;

import com.toan.server.entity.User;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean isActive;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email, String role, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }

    public static UserResponse from(User user) {
        String displayName = user.getFullname() != null && !user.getFullname().isBlank()
                ? user.getFullname()
                : user.getUsername();
        String roleName = user.getRole() != null ? user.getRole().name() : null;
        return new UserResponse(
                user.getId(),
                displayName,
                user.getEmail(),
                roleName,
                user.getIsActive()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
