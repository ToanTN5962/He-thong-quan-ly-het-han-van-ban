package com.toan.server.repository;

import com.toan.server.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByUploadedAtBetween(LocalDateTime start, LocalDateTime end);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Attachment a
        SET a.deletedAt = CURRENT_TIMESTAMP
        WHERE a.document.id = :documentId
          AND a.deletedAt IS NULL
    """)
    int softDeleteByDocumentId(@Param("documentId") Long documentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Attachment a
        SET a.deletedAt = CURRENT_TIMESTAMP
        WHERE a.id = :id
          AND a.deletedAt IS NULL
    """)
    int softDeleteById(@Param("id") Long id);
}
