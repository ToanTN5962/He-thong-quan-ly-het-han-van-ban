package com.toan.server.dto.response;

import com.toan.server.dto.response.AttachmentResponse;
import com.toan.server.entity.Document;
import com.toan.server.enums.DocumentStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class DocumentResponse {

    private Long id;
    private String title;
    private String documentNumber;
    private String summary;
    private String issuingAgency;
    private LocalDate enactedDate;
    private LocalDate effectiveDate;
    private LocalDate expireDate;
    private DocumentStatus status;
    private String category;
    private String ownerEmail;
    private List<AttachmentResponse> attachments;

    public DocumentResponse() {
    }

    public DocumentResponse(Long id, String title, String documentNumber, String summary,
                            String issuingAgency, LocalDate enactedDate, LocalDate effectiveDate,
                            LocalDate expireDate, DocumentStatus status, String category,
                            String ownerEmail, List<AttachmentResponse> attachments) {
        this.id = id;
        this.title = title;
        this.documentNumber = documentNumber;
        this.summary = summary;
        this.issuingAgency = issuingAgency;
        this.enactedDate = enactedDate;
        this.effectiveDate = effectiveDate;
        this.expireDate = expireDate;
        this.status = status;
        this.category = category;
        this.ownerEmail = ownerEmail;
        this.attachments = attachments;
    }

    public static DocumentResponse from(Document document) {
        String categoryName = document.getCategory() != null ? document.getCategory().getName() : null;
        String ownerEmail = document.getOwner() != null ? document.getOwner().getEmail() : null;
        List<AttachmentResponse> attachments = document.getAttachments() != null
                ? document.getAttachments().stream().map(AttachmentResponse::from).collect(Collectors.toList())
                : List.<AttachmentResponse>of();

        return new DocumentResponse(
                document.getId(),
                document.getTitle(),
                document.getDocumentNumber(),
                document.getSummary(),
                document.getIssuingAgency(),
                document.getEnactedDate(),
                document.getEffectiveDate(),
                document.getExpireDate(),
                document.getStatus(),
                categoryName,
                ownerEmail,
                attachments
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getIssuingAgency() {
        return issuingAgency;
    }

    public void setIssuingAgency(String issuingAgency) {
        this.issuingAgency = issuingAgency;
    }

    public LocalDate getEnactedDate() {
        return enactedDate;
    }

    public void setEnactedDate(LocalDate enactedDate) {
        this.enactedDate = enactedDate;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public LocalDate getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(LocalDate expireDate) {
        this.expireDate = expireDate;
    }

    public DocumentStatus getStatus() {
        return status;
    }

    public void setStatus(DocumentStatus status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public java.util.List<AttachmentResponse> getAttachments() {
        return attachments;
    }

    public void setAttachments(java.util.List<AttachmentResponse> attachments) {
        this.attachments = attachments;
    }
}
