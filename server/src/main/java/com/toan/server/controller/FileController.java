package com.toan.server.controller;

import com.toan.server.entity.Document;
import com.toan.server.repository.AttachmentRepository;
import com.toan.server.service.StorageService;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final StorageService storageService;
    private final AttachmentRepository attachmentRepository;

    public FileController(StorageService storageService, AttachmentRepository attachmentRepository) {
        this.storageService = storageService;
        this.attachmentRepository = attachmentRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile[] files,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "issuingAgency", required = false) String issuingAgency,
            @RequestParam(value = "issueDate", required = false) String issueDate,
            @RequestParam(value = "effectiveDate", required = false) String effectiveDate,
            @RequestParam(value = "expiryDate", required = false) String expiryDate,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "ownerEmail", required = false) String ownerEmail
    ) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng chọn ít nhất một file hợp lệ!"));
        }
        try {
            Document savedDocument = storageService.uploadFile(
                    files,
                    title,
                    code,
                    description,
                    issuingAgency,
                    issueDate,
                    effectiveDate,
                    expiryDate,
                    category,
                    ownerEmail
            );

            java.util.List<String> fileUrls = savedDocument.getAttachments().stream()
                    .map(attachment -> attachment.getFilePath())
                    .toList();

            return ResponseEntity.ok(Map.of(
                    "message", "Upload file và lưu tài liệu thành công!",
                    "fileUrls", fileUrls,
                    "documentId", savedDocument.getId(),
                    "documentTitle", savedDocument.getTitle()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllFiles() {
        try {
            java.util.List<String> files = storageService.listAllFiles();
            return ResponseEntity.ok(files);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/preview")
    public ResponseEntity<String> getFilePreviewUrl(@RequestParam String fileName) {
        String url = storageService.generatePresignedUrl(fileName);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        int updatedRows = attachmentRepository.softDeleteById(id);
        if (updatedRows == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
