package com.toan.server.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class AuditLogConstraintMigration {

    @Bean
    ApplicationRunner updateAuditLogActionConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check");
            jdbcTemplate.execute("""
                    ALTER TABLE audit_logs
                    ADD CONSTRAINT audit_logs_action_check
                    CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'UPLOAD', 'REGISTER'))
                    """);
        };
    }
}
