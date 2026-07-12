package com.toan.server.controller;

import com.toan.server.dto.response.DocumentResponse;
import com.toan.server.entity.AuditLog;
import com.toan.server.entity.Document;
import com.toan.server.entity.User;
import com.toan.server.enums.AuditAction;
import com.toan.server.repository.AttachmentRepository;
import com.toan.server.repository.AuditLogRepository;
import com.toan.server.repository.DocumentRepository;
import com.toan.server.repository.UserRepository;
import com.toan.server.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public DocumentController(DocumentRepository documentRepository,
                              AttachmentRepository attachmentRepository,
                              UserRepository userRepository,
                              AuditLogRepository auditLogRepository,
                              NotificationService notificationService) {
        this.documentRepository = documentRepository;
        this.attachmentRepository = attachmentRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        List<DocumentResponse> documents = documentRepository.findAllWithDetailsOrderByCreatedAtDesc().stream()
                .map(DocumentResponse::from)
                .toList();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByOwnerEmail(
            @RequestParam("ownerEmail") String ownerEmail
    ) {
        String decodedEmail = URLDecoder.decode(ownerEmail, StandardCharsets.UTF_8);
        List<DocumentResponse> documents = documentRepository.findByOwnerEmailOrderByCreatedAtDesc(decodedEmail).stream()
                .map(DocumentResponse::from)
                .toList();
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id,
            @RequestParam("userEmail") String userEmail
    ) {
        return documentRepository.findById(id)
                .map(document -> {
                    String decodedEmail = URLDecoder.decode(userEmail, StandardCharsets.UTF_8);
                    User actor = userRepository.findByEmail(decodedEmail)
                            .orElse(document.getOwner());

                    User owner = document.getOwner();
                    if (owner != null) {
                        notificationService.createDeletedDocumentNotification(owner, document);
                    }

                    createDeleteAuditLog(actor, document);
                    attachmentRepository.softDeleteByDocumentId(document.getId());
                    int updatedRows = documentRepository.softDeleteById(document.getId());
                    if (updatedRows == 0) {
                        return ResponseEntity.notFound().<Void>build();
                    }

                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private void createDeleteAuditLog(User actor, Document document) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(AuditAction.DELETE);
        auditLog.setUser(actor);
        auditLog.setDocument(document);
        auditLog.setCreatedAt(LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }
}
