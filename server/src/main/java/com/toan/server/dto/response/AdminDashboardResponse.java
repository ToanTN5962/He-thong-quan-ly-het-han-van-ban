package com.toan.server.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class AdminDashboardResponse {

    private Summary summary;
    private List<UploadTimelineItem> uploadTimeline;
    private UploadStats uploadStats;
    private List<AuditLogItem> auditLogs;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(Summary summary, List<UploadTimelineItem> uploadTimeline,
                                  UploadStats uploadStats, List<AuditLogItem> auditLogs) {
        this.summary = summary;
        this.uploadTimeline = uploadTimeline;
        this.uploadStats = uploadStats;
        this.auditLogs = auditLogs;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public List<UploadTimelineItem> getUploadTimeline() {
        return uploadTimeline;
    }

    public void setUploadTimeline(List<UploadTimelineItem> uploadTimeline) {
        this.uploadTimeline = uploadTimeline;
    }

    public UploadStats getUploadStats() {
        return uploadStats;
    }

    public void setUploadStats(UploadStats uploadStats) {
        this.uploadStats = uploadStats;
    }

    public List<AuditLogItem> getAuditLogs() {
        return auditLogs;
    }

    public void setAuditLogs(List<AuditLogItem> auditLogs) {
        this.auditLogs = auditLogs;
    }

    public static class Summary {
        private Long totalDocuments;
        private Long totalFiles;
        private Long expiredDocuments;
        private Long activeDocuments;

        public Summary() {
        }

        public Summary(Long totalDocuments, Long totalFiles, Long expiredDocuments, Long activeDocuments) {
            this.totalDocuments = totalDocuments;
            this.totalFiles = totalFiles;
            this.expiredDocuments = expiredDocuments;
            this.activeDocuments = activeDocuments;
        }

        public Long getTotalDocuments() {
            return totalDocuments;
        }

        public void setTotalDocuments(Long totalDocuments) {
            this.totalDocuments = totalDocuments;
        }

        public Long getTotalFiles() {
            return totalFiles;
        }

        public void setTotalFiles(Long totalFiles) {
            this.totalFiles = totalFiles;
        }

        public Long getExpiredDocuments() {
            return expiredDocuments;
        }

        public void setExpiredDocuments(Long expiredDocuments) {
            this.expiredDocuments = expiredDocuments;
        }

        public Long getActiveDocuments() {
            return activeDocuments;
        }

        public void setActiveDocuments(Long activeDocuments) {
            this.activeDocuments = activeDocuments;
        }
    }

    public static class UploadTimelineItem {
        private String label;
        private Long fileCount;
        private Integer value;

        public UploadTimelineItem() {
        }

        public UploadTimelineItem(String label, Long fileCount, Integer value) {
            this.label = label;
            this.fileCount = fileCount;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public Long getFileCount() {
            return fileCount;
        }

        public void setFileCount(Long fileCount) {
            this.fileCount = fileCount;
        }

        public Integer getValue() {
            return value;
        }

        public void setValue(Integer value) {
            this.value = value;
        }
    }

    public static class UploadStats {
        private Long topDayFiles;
        private Long averageFiles;

        public UploadStats() {
        }

        public UploadStats(Long topDayFiles, Long averageFiles) {
            this.topDayFiles = topDayFiles;
            this.averageFiles = averageFiles;
        }

        public Long getTopDayFiles() {
            return topDayFiles;
        }

        public void setTopDayFiles(Long topDayFiles) {
            this.topDayFiles = topDayFiles;
        }

        public Long getAverageFiles() {
            return averageFiles;
        }

        public void setAverageFiles(Long averageFiles) {
            this.averageFiles = averageFiles;
        }
    }

    public static class AuditLogItem {
        private Long id;
        private String event;
        private String actor;
        private String detail;
        private LocalDateTime createdAt;

        public AuditLogItem() {
        }

        public AuditLogItem(Long id, String event, String actor, String detail, LocalDateTime createdAt) {
            this.id = id;
            this.event = event;
            this.actor = actor;
            this.detail = detail;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEvent() {
            return event;
        }

        public void setEvent(String event) {
            this.event = event;
        }

        public String getActor() {
            return actor;
        }

        public void setActor(String actor) {
            this.actor = actor;
        }

        public String getDetail() {
            return detail;
        }

        public void setDetail(String detail) {
            this.detail = detail;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
