package com.toan.server.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class NotificationTypeConstraintMigration {

    @Bean
    ApplicationRunner updateNotificationTypeConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("""
                    DO $$
                    DECLARE
                        constraint_record RECORD;
                    BEGIN
                        FOR constraint_record IN
                            SELECT conname
                            FROM pg_constraint
                            WHERE conrelid = 'notifications'::regclass
                              AND contype = 'c'
                              AND pg_get_constraintdef(oid) LIKE '%notification_type%'
                        LOOP
                            EXECUTE format(
                                'ALTER TABLE notifications DROP CONSTRAINT IF EXISTS %I',
                                constraint_record.conname
                            );
                        END LOOP;
                    END $$;
                    """);

            jdbcTemplate.execute("""
                    ALTER TABLE notifications
                    ADD CONSTRAINT notifications_notification_type_check
                    CHECK (notification_type IN ('EXPIRING', 'EXPIRED', 'NEW_DOCUMENT', 'DELETED_DOCUMENT'))
                    """);
        };
    }
}
