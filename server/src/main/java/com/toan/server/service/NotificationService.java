package com.toan.server.service;

import com.toan.server.entity.Document;
import com.toan.server.entity.Notification;
import com.toan.server.entity.User;
import com.toan.server.enums.NotificationType;
import com.toan.server.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createWarningNotification(User user, Document document, long daysRemaining) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setDocument(document);

        notification.setTitle("Cảnh báo văn bản sắp hết hạn");

        String content = "Văn bản \"" + document.getTitle() +
                "\" sẽ hết hạn sau " + daysRemaining + " ngày.";

        notification.setContent(content);

        //Đảm bảo không tạo thông báo trùng trong trường hợp cron chạy 2 lần trong ngày
        if (notificationRepository.existsByUserAndDocumentAndNotificationTypeAndContent(
            user,
            document,
            NotificationType.EXPIRING,
            content)) {
                return;
            }

        notification.setNotificationType(NotificationType.EXPIRING);

        notification.setIsRead(false);

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }
}