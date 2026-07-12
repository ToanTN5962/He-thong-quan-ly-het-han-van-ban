-- Department
INSERT INTO departments (id, name) VALUES (1, 'Phòng Hành chính');
INSERT INTO departments (id, name) VALUES (2, 'Phòng Pháp chế');

-- Users
INSERT INTO users (id, username, email, password, fullname, role, is_active, created_at)
VALUES (1, 'admin', 'admin@example.com', '123456', 'Quản trị viên', 'ADMIN', true, NOW());

INSERT INTO users (id, username, email, password, fullname, role, is_active, created_at, department_id)
VALUES (2, 'user1', 'user1@example.com', '123456', 'Người dùng 1', 'USER', true, NOW(), 1);

-- DocumentCategory
INSERT INTO document_categories (id, name, description) VALUES (1, 'Luật', 'Các văn bản luật');
INSERT INTO document_categories (id, name, description) VALUES (2, 'Thông tư', 'Các văn bản thông tư');
