package com.toan.server.controller;

import com.toan.server.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile[] files,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "expiryDate", required = false) String expiryDate,
            @RequestParam(value = "description", required = false) String description
    ) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng chọn ít nhất một file hợp lệ!"));
        }
        try {
            java.util.List<String> fileUrls = new java.util.ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;
                fileUrls.add(storageService.uploadFile(file));
            }
            return ResponseEntity.ok(Map.of(
                    "message", "Upload file lên AWS thành công!",
                    "fileUrls", fileUrls,
                    "metadata", Map.of(
                            "code", code,
                            "title", title,
                            "category", category,
                            "expiryDate", expiryDate,
                            "description", description
                    )
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
}