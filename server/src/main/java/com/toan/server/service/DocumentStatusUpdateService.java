package com.toan.server.service;

import java.time.LocalDate;
import java.time.ZoneId;
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
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void updateDocumentStatus() {

        LocalDate today = LocalDate.now(VIETNAM_ZONE);

        List<Document> documents =
                documentRepository.findByStatusIn(
                        List.of(DocumentStatus.ACTIVE, DocumentStatus.EXPIRINGSOON)
                );

        for (Document document : documents) {
            if (document.getExpireDate() == null) {
                continue;
            }

            long daysRemaining = ChronoUnit.DAYS.between(today, document.getExpireDate());

            if (daysRemaining < 0) {
                document.setStatus(DocumentStatus.EXPIRED);
            } else if (daysRemaining <= 30) {
                document.setStatus(DocumentStatus.EXPIRINGSOON);
            } else {
                document.setStatus(DocumentStatus.ACTIVE);
            }
        }
    }
}
