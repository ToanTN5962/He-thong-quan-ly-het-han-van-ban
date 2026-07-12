package com.toan.server.controller;

import com.toan.server.dto.response.NotificationResponse;
import com.toan.server.repository.NotificationRepository;
import com.toan.server.entity.Notification;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/user")
    public List<NotificationResponse> getNotificationsByUserEmail(@RequestParam String email) {
        List<Notification> list = notificationRepository.findByUserEmailOrderByCreatedAtDesc(email);
        return list.stream().map(NotificationResponse::from).collect(Collectors.toList());
    }
}
