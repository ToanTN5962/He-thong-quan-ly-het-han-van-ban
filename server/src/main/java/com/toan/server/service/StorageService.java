package com.toan.server.service;
import com.toan.server.entity.Document;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    Document uploadFile(
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
    );
    void deleteFile(String fileUrl);
    java.util.List<String> listAllFiles();
}