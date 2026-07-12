package com.toan.server.dto.response;

import com.toan.server.enums.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String title;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private NotificationType notificationType;
    private Long documentId;
    private String documentTitle;

    public NotificationResponse() {}

    public NotificationResponse(Long id, String title, String content, Boolean isRead, LocalDateTime createdAt, NotificationType notificationType, Long documentId, String documentTitle) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.notificationType = notificationType;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
    }

    public static NotificationResponse from(com.toan.server.entity.Notification n) {
        Long docId = n.getDocument() != null ? n.getDocument().getId() : null;
        String docTitle = n.getDocument() != null ? n.getDocument().getTitle() : null;
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getIsRead(),
                n.getCreatedAt(),
                n.getNotificationType(),
                docId,
                docTitle
        );
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Boolean getIsRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public NotificationType getNotificationType() { return notificationType; }
    public Long getDocumentId() { return documentId; }
    public String getDocumentTitle() { return documentTitle; }
}
