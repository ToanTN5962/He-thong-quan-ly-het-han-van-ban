package com.toan.server.repository;

import com.toan.server.entity.DocumentCategory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentCategoryRepository extends JpaRepository<DocumentCategory, Long> {
    Optional<DocumentCategory> findByName(String name);
}