package com.toan.server.service.impl;

import com.toan.server.entity.Attachment;
import com.toan.server.entity.AuditLog;
import com.toan.server.entity.Document;
import com.toan.server.entity.DocumentCategory;
import com.toan.server.enums.AuditAction;
import com.toan.server.enums.DocumentStatus;
import com.toan.server.repository.AttachmentRepository;
import com.toan.server.repository.AuditLogRepository;
import com.toan.server.repository.DocumentCategoryRepository;
import com.toan.server.repository.DocumentRepository;
import com.toan.server.repository.UserRepository;
import com.toan.server.service.NotificationService;
import com.toan.server.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import java.util.stream.Collectors;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Service
public class S3StorageServiceImpl implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentCategoryRepository documentCategoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private NotificationService notificationService;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public S3StorageServiceImpl(S3Client s3Client, S3Presigner s3Presigner) {
    this.s3Client = s3Client;
    this.s3Presigner = s3Presigner;
}

    @Override
    public Document uploadFile(
        MultipartFile[] files,
        String title,
        String documentNumber,
        String summary,
        String issuingAgency,
        String enactedDate,
        String effectiveDate,
        String expireDate,
        String categoryName,
        String ownerEmail
    ) {

        Document document = new Document();
        document.setTitle(title);
        document.setDocumentNumber(documentNumber);
        document.setSummary(summary);
        document.setIssuingAgency(issuingAgency);

        if (enactedDate != null && !enactedDate.isBlank()) {
            document.setEnactedDate(LocalDate.parse(enactedDate));
        }
        if (effectiveDate != null && !effectiveDate.isBlank()) {
            document.setEffectiveDate(LocalDate.parse(effectiveDate));
        }
        if (expireDate != null && !expireDate.isBlank()) {
            document.setExpireDate(LocalDate.parse(expireDate));
        }

        if (categoryName != null && !categoryName.isBlank()) {
            DocumentCategory category = documentCategoryRepository.findByName(categoryName)
                    .orElseGet(() -> {
                        DocumentCategory newCategory = new DocumentCategory();
                        newCategory.setName(categoryName);
                        return documentCategoryRepository.save(newCategory);
                    });
            document.setCategory(category);
        }

        if (ownerEmail != null && !ownerEmail.isBlank()) {
            userRepository.findByEmail(ownerEmail).ifPresent(document::setOwner);
        }

        document.setStatus(DocumentStatus.ACTIVE);
        document.setCreatedAt(LocalDateTime.now());
        document.setUpdatedAt(LocalDateTime.now());

        Document savedDocument = documentRepository.save(document);
        
        if (files != null && files.length > 0) {
            List<Attachment> attachments = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String originalFileName = file.getOriginalFilename();
                String fileExtension = originalFileName != null && originalFileName.contains(".") 
                        ? originalFileName.substring(originalFileName.lastIndexOf(".")) 
                        : "";
                String storedName = UUID.randomUUID().toString() + fileExtension;

                try {
                    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(storedName)
                            .contentType(file.getContentType())
                            .build();

                    s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

                    String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, storedName);

                    Attachment attachment = new Attachment();
                    attachment.setOriginalName(originalFileName);
                    attachment.setStoredName(storedName);
                    attachment.setFilePath(fileUrl);
                    attachment.setFileSize(file.getSize());
                    attachment.setUploadedAt(LocalDateTime.now());
                    attachment.setDocument(savedDocument);

                    attachments.add(attachment);

                } catch (IOException e) {
                    throw new RuntimeException("Lỗi xảy ra trong quá trình upload file lên AWS S3: " + e.getMessage());
                }
            }
            
            if (!attachments.isEmpty()) {
                attachmentRepository.saveAll(attachments);
                savedDocument.setAttachments(attachments);
            }
        }

        if (savedDocument.getOwner() != null) {
            notificationService.createNewDocumentNotification(savedDocument.getOwner(), savedDocument);
        }

        AuditLog auditLog = new AuditLog();
        auditLog.setAction(AuditAction.UPLOAD);
        auditLog.setCreatedAt(LocalDateTime.now());
        auditLog.setUser(savedDocument.getOwner());
        auditLog.setDocument(savedDocument);
        auditLogRepository.save(auditLog);

        return savedDocument;
    }

    @Override
    public java.util.List<String> listAllFiles() {
        ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .build();

        ListObjectsV2Response listObjectsV2Response = s3Client.listObjectsV2(listObjectsV2Request);

        return listObjectsV2Response.contents().stream()
                .map(s3Object -> String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Object.key()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFile(String fileUrl) {
        // Trích xuất lấy 'key' (tên file) từ chuỗi URL đầy đủ để xóa
        String key = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
    }

    @Override
    public String generatePresignedUrl(String fileUrlOrKey) {
        String key = fileUrlOrKey.contains("/") 
                ? fileUrlOrKey.substring(fileUrlOrKey.lastIndexOf("/") + 1) 
                : fileUrlOrKey;

        software.amazon.awssdk.services.s3.model.GetObjectRequest getObjectRequest = 
                software.amazon.awssdk.services.s3.model.GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

        GetObjectPresignRequest presignedRequest = 
                GetObjectPresignRequest.builder()
                        .signatureDuration(java.time.Duration.ofMinutes(15)) 
                        .getObjectRequest(getObjectRequest)
                        .build();

        return s3Presigner.presignGetObject(presignedRequest).url().toString();
    }
}
