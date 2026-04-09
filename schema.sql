-- RK World Tower CRM - Database Schema
-- Import this file into your MySQL database via Plesk

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  office_number VARCHAR(100) NOT NULL,
  ownership_type VARCHAR(20) NOT NULL,
  owners TEXT NOT NULL,
  tenants TEXT NULL,
  allotted_parking TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_office_number (office_number),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
