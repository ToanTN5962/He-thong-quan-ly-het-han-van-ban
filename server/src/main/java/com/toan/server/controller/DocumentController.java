package com.toan.server.controller;

import com.toan.server.dto.response.DocumentResponse;
import com.toan.server.repository.DocumentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentRepository documentRepository;

    public DocumentController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping("/owner")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByOwnerEmail(
            @RequestParam("ownerEmail") String ownerEmail
    ) {
        List<DocumentResponse> documents = documentRepository.findByOwnerEmail(ownerEmail).stream()
                .map(DocumentResponse::from)
                .toList();
        return ResponseEntity.ok(documents);
    }
}
