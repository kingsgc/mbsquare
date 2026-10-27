-- ============================================================
-- DataWise: Add API Access Control
-- ============================================================
-- Adds apiAccess field to subscribers to control who can use the API
-- and creates an apiusage table to track API usage.
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- -----------------------------------------------------------
-- 1. Add apiAccess column to subscribers table
--    0 = No API access (default)
--    1 = API access enabled
-- -----------------------------------------------------------
ALTER TABLE `subscribers`
  ADD COLUMN `apiAccess` tinyint(4) NOT NULL DEFAULT 0
  AFTER `sPaga`;

-- -----------------------------------------------------------
-- 2. Create apiusage table to track API requests
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `apiusage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sId` int(11) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL,
  `status_code` int(11) NOT NULL DEFAULT 0,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_date` (`sId`, `created_at`),
  KEY `idx_endpoint` (`endpoint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------------
-- 3. Create apitokens table for token management
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `apitokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sId` int(11) NOT NULL,
  `token` varchar(200) NOT NULL,
  `name` varchar(100) DEFAULT 'Default',
  `permissions` text DEFAULT NULL,
  `last_used` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_token` (`token`),
  KEY `idx_user` (`sId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------------------
-- 4. Migrate existing API keys to apitokens table
-- -----------------------------------------------------------
INSERT IGNORE INTO `apitokens` (`sId`, `token`, `name`, `is_active`, `created_at`)
SELECT `sId`, `sApiKey`, 'Primary API Key', 1, `sRegDate`
FROM `subscribers`
WHERE `sApiKey` IS NOT NULL AND `sApiKey` != '';

COMMIT;

-- ============================================================
-- Done. API access control is now available.
-- ============================================================
