package com.toan.server.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileUrl);
    java.util.List<String> listAllFiles();
}