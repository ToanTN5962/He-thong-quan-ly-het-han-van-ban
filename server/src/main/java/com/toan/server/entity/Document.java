package com.toan.server.entity;

import com.toan.server.enums.DocumentStatus;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "documents")
@SQLDelete(sql = "UPDATE documents SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String documentNumber;

    private String summary;

    private String issuingAgency;

    private LocalDate enactedDate;

    private LocalDate effectiveDate;

    private LocalDate expireDate;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DocumentCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "document")
    @SQLRestriction("deleted_at IS NULL")
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "document")
    private List<Notification> notifications = new ArrayList<>();
}