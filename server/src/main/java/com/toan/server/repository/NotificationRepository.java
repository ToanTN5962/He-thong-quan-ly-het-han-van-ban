package com.toan.server.repository;

import com.toan.server.entity.Document;
import com.toan.server.entity.Notification;
import com.toan.server.entity.User;
import com.toan.server.enums.NotificationType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    boolean existsByUserAndDocumentAndNotificationTypeAndContent(
        User user,
        Document document,
        NotificationType notificationType,
        String content
    );
}