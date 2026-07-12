package com.toan.server.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.toan.server.entity.Document;
import com.toan.server.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpiryCheckService {

    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    @Scheduled(cron = "0 0 0 * * *")
    public void checkExpiryDocuments() {

        LocalDate today = LocalDate.now();

        List<Document> documents =
                documentRepository.findDocumentsExpiringBetween(
                        today,
                        today.plusDays(30)
                );

        for (Document doc : documents) {

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