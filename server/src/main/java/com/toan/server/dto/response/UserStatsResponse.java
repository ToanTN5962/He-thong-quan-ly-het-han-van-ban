package com.toan.server.dto.response;

public class UserStatsResponse {

    private Long totalUsers;
    private Long activeUsers;
    private Long lockedUsers;

    public UserStatsResponse() {
    }

    public UserStatsResponse(Long totalUsers, Long activeUsers, Long lockedUsers) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.lockedUsers = lockedUsers;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Long getLockedUsers() {
        return lockedUsers;
    }

    public void setLockedUsers(Long lockedUsers) {
        this.lockedUsers = lockedUsers;
    }
}
