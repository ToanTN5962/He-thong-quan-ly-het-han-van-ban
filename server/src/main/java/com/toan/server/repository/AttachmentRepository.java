package com.toan.server.repository;

import com.toan.server.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByUploadedAtBetween(LocalDateTime start, LocalDateTime end);
}
