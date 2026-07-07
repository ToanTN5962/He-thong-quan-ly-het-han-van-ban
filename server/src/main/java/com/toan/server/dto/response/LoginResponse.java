package com.toan.server.dto.response;

public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String fullname;
    private String role;

    public LoginResponse(String token, String email, String fullname, String role) {
        this.token = token;
        this.email = email;
        this.fullname = fullname;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}