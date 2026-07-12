package com.toan.server.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.toan.server.entity.Document;
import com.toan.server.enums.DocumentStatus;
import com.toan.server.repository.DocumentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentStatusUpdateService {

    private final DocumentRepository documentRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateDocumentStatus() {

        LocalDate today = LocalDate.now();

        List<Document> documents =
                documentRepository.findByStatusIn(
                        List.of(DocumentStatus.ACTIVE, DocumentStatus.EXPIRINGSOON)
                );

        for (Document document : documents) {

            long daysRemaining = ChronoUnit.DAYS.between(today, document.getExpireDate());

            if (daysRemaining < 0) {
                document.setStatus(DocumentStatus.EXPIRED);
            } else if (daysRemaining <= 30) {
                document.setStatus(DocumentStatus.EXPIRINGSOON);
            }
        }
    }
}