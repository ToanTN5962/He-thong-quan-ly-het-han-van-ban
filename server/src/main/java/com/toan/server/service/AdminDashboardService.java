package com.toan.server.service;

import com.toan.server.dto.response.AdminDashboardResponse;
import com.toan.server.entity.Attachment;
import com.toan.server.entity.AuditLog;
import com.toan.server.enums.AuditAction;
import com.toan.server.enums.DocumentStatus;
import com.toan.server.repository.AttachmentRepository;
import com.toan.server.repository.AuditLogRepository;
import com.toan.server.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final DocumentRepository documentRepository;
    private final AttachmentRepository attachmentRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminDashboardService(DocumentRepository documentRepository,
                                 AttachmentRepository attachmentRepository,
                                 AuditLogRepository auditLogRepository) {
        this.documentRepository = documentRepository;
        this.attachmentRepository = attachmentRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public AdminDashboardResponse getDashboard() {
        long totalDocuments = documentRepository.count();
        long totalFiles = attachmentRepository.count();
        long expiredDocuments = documentRepository.countByStatus(DocumentStatus.EXPIRED);
        long activeDocuments = Math.max(totalDocuments - expiredDocuments, 0);

        AdminDashboardResponse.Summary summary = new AdminDashboardResponse.Summary(
                totalDocuments,
                totalFiles,
                expiredDocuments,
                activeDocuments
        );

        List<AdminDashboardResponse.UploadTimelineItem> uploadTimeline = buildUploadTimeline();
        long topDayFiles = uploadTimeline.stream()
                .map(AdminDashboardResponse.UploadTimelineItem::getFileCount)
                .max(Comparator.naturalOrder())
                .orElse(0L);
        long averageFiles = Math.round(uploadTimeline.stream()
                .mapToLong(AdminDashboardResponse.UploadTimelineItem::getFileCount)
                .average()
                .orElse(0));

        AdminDashboardResponse.UploadStats uploadStats = new AdminDashboardResponse.UploadStats(topDayFiles, averageFiles);
        List<AdminDashboardResponse.AuditLogItem> auditLogs = auditLogRepository.findTop4ByOrderByCreatedAtDesc().stream()
                .map(this::toAuditLogItem)
                .toList();

        return new AdminDashboardResponse(summary, uploadTimeline, uploadStats, auditLogs);
    }

    private List<AdminDashboardResponse.UploadTimelineItem> buildUploadTimeline() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        Map<LocalDate, Long> countsByDate = attachmentRepository.findByUploadedAtBetween(start, end).stream()
                .filter(attachment -> attachment.getUploadedAt() != null)
                .collect(Collectors.groupingBy(
                        attachment -> attachment.getUploadedAt().toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        long maxCount = countsByDate.values().stream().max(Comparator.naturalOrder()).orElse(0L);

        return startDate.datesUntil(today.plusDays(1))
                .map(date -> {
                    long fileCount = countsByDate.getOrDefault(date, 0L);
                    int value = maxCount == 0 ? 0 : (int) Math.round((fileCount * 100.0) / maxCount);
                    return new AdminDashboardResponse.UploadTimelineItem(toVietnameseDayLabel(date), fileCount, value);
                })
                .toList();
    }

    private AdminDashboardResponse.AuditLogItem toAuditLogItem(AuditLog log) {
        String actor = log.getUser() != null ? log.getUser().getEmail() : "H\u1ec7 th\u1ed1ng";
        String documentTitle = log.getDocument() != null ? log.getDocument().getTitle() : null;
        return new AdminDashboardResponse.AuditLogItem(
                log.getId(),
                toEventLabel(log.getAction()),
                actor,
                toDetail(log.getAction(), documentTitle),
                log.getCreatedAt()
        );
    }

    private String toEventLabel(AuditAction action) {
        if (action == null) {
            return "Ho\u1ea1t \u0111\u1ed9ng h\u1ec7 th\u1ed1ng";
        }
        return switch (action) {
            case CREATE -> "T\u1ea1o d\u1eef li\u1ec7u";
            case UPDATE -> "C\u1eadp nh\u1eadt d\u1eef li\u1ec7u";
            case DELETE -> "X\u00f3a d\u1eef li\u1ec7u";
            case LOGIN -> "\u0110\u0103ng nh\u1eadp";
            case UPLOAD -> "Upload t\u00e0i li\u1ec7u";
            case REGISTER -> "T\u1ea1o t\u00e0i kho\u1ea3n";
        };
    }

    private String toDetail(AuditAction action, String documentTitle) {
        String target = documentTitle != null ? documentTitle : "h\u1ec7 th\u1ed1ng";
        if (action == null) {
            return "Ghi nh\u1eadn ho\u1ea1t \u0111\u1ed9ng tr\u00ean " + target;
        }
        return switch (action) {
            case CREATE -> "T\u1ea1o m\u1edbi " + target;
            case UPDATE -> "C\u1eadp nh\u1eadt " + target;
            case DELETE -> "X\u00f3a " + target;
            case LOGIN -> "\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng v\u00e0o h\u1ec7 th\u1ed1ng";
            case UPLOAD -> "Upload file cho " + target;
            case REGISTER -> "T\u1ea1o t\u00e0i kho\u1ea3n ng\u01b0\u1eddi d\u00f9ng";
        };
    }

    private String toVietnameseDayLabel(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        if (day == DayOfWeek.SUNDAY) {
            return "CN";
        }
        return "T" + (day.getValue() + 1);
    }
}

