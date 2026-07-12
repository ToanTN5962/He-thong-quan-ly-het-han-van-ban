package com.toan.server.repository;

import com.toan.server.entity.AuditLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @EntityGraph(attributePaths = {"user", "document"})
    List<AuditLog> findTop4ByOrderByCreatedAtDesc();
}
