package com.toan.server.repository;

import com.toan.server.entity.Document;
import com.toan.server.enums.DocumentStatus;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    @Query("""
        SELECT d
        FROM Document d
        WHERE d.expireDate BETWEEN :today AND :maxDate
          AND d.owner IS NOT NULL
          AND d.status IN :statuses
    """)
    List<Document> findDocumentsExpiringBetween(
            @Param("today") LocalDate today,
            @Param("maxDate") LocalDate maxDate,
            @Param("statuses") List<DocumentStatus> statuses
    );

    List<Document> findByStatusIn(List<DocumentStatus> statuses);

    Long countByStatus(DocumentStatus status);

    @Query("""
        SELECT DISTINCT d
        FROM Document d
        LEFT JOIN FETCH d.owner o
        LEFT JOIN FETCH d.category c
        LEFT JOIN FETCH d.attachments a
        ORDER BY d.createdAt DESC
    """)
    List<Document> findAllWithDetailsOrderByCreatedAtDesc();

    @Query("""
        SELECT DISTINCT d
        FROM Document d
        JOIN FETCH d.owner o
        LEFT JOIN FETCH d.category c
        LEFT JOIN FETCH d.attachments a
        WHERE o.email = :ownerEmail
        ORDER BY d.createdAt DESC
    """)
    List<Document> findByOwnerEmailOrderByCreatedAtDesc(@Param("ownerEmail") String ownerEmail);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Document d
        SET d.deletedAt = CURRENT_TIMESTAMP
        WHERE d.id = :id
          AND d.deletedAt IS NULL
    """)
    int softDeleteById(@Param("id") Long id);
}
