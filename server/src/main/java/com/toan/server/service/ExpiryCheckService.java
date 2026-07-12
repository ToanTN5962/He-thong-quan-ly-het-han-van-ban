package com.toan.server.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.toan.server.entity.Document;
import com.toan.server.enums.DocumentStatus;
import com.toan.server.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpiryCheckService {

    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void checkExpiryDocuments() {

        LocalDate today = LocalDate.now(VIETNAM_ZONE);

        List<Document> documents =
                documentRepository.findDocumentsExpiringBetween(
                        today,
                        today.plusDays(30),
                        List.of(DocumentStatus.ACTIVE, DocumentStatus.EXPIRINGSOON)
                );

        for (Document doc : documents) {
            if (doc.getExpireDate() == null || doc.getOwner() == null) {
                continue;
            }

            long daysRemaining = java.time.temporal.ChronoUnit.DAYS
                    .between(today, doc.getExpireDate());

            if (daysRemaining == 30 ||
                daysRemaining == 15 ||
                daysRemaining == 7 ||
                daysRemaining == 3 ||
                daysRemaining == 1) {

                notificationService.createWarningNotification(
                    doc.getOwner(), doc, daysRemaining
                );
            }
        }
    }
}
