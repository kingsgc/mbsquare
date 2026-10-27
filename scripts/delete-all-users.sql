-- ============================================================
-- DataWise: Delete All Users and Related Data
-- ============================================================
-- WARNING: This is irreversible. Backup your database first.
-- Database: hxcrnsok_userbase
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Disable foreign key checks temporarily for clean deletion
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------
-- 1. Delete all user-related transaction data
-- -----------------------------------------------------------
DELETE FROM `transactions`;
DELETE FROM `reports`;
DELETE FROM `beneficiary`;
DELETE FROM `manualfunds`;
DELETE FROM `contact`;
DELETE FROM `issues`;
DELETE FROM `notifications`;
DELETE FROM `flash_noti`;

-- -----------------------------------------------------------
-- 2. Delete all user login sessions
-- -----------------------------------------------------------
DELETE FROM `userlogin`;
DELETE FROM `uservisits`;

-- -----------------------------------------------------------
-- 3. Delete user-generated tokens and pins
-- -----------------------------------------------------------
DELETE FROM `airtimetokens`;
DELETE FROM `airtimepinstock`;
DELETE FROM `datatokens`;
DELETE FROM `datapins`;

-- -----------------------------------------------------------
-- 4. Delete virtual account mappings
-- -----------------------------------------------------------
DELETE FROM `monnify_accounts`;
DELETE FROM `billstack_accounts`;
DELETE FROM `strowallet_accounts`;

-- -----------------------------------------------------------
-- 5. Delete all subscriber accounts (the main user table)
-- -----------------------------------------------------------
DELETE FROM `subscribers`;

-- -----------------------------------------------------------
-- 6. Reset auto-increment counters
-- -----------------------------------------------------------
ALTER TABLE `subscribers` AUTO_INCREMENT = 1;
ALTER TABLE `transactions` AUTO_INCREMENT = 1;
ALTER TABLE `userlogin` AUTO_INCREMENT = 1;
ALTER TABLE `uservisits` AUTO_INCREMENT = 1;
ALTER TABLE `beneficiary` AUTO_INCREMENT = 1;
ALTER TABLE `manualfunds` AUTO_INCREMENT = 1;
ALTER TABLE `contact` AUTO_INCREMENT = 1;
ALTER TABLE `issues` AUTO_INCREMENT = 1;
ALTER TABLE `notifications` AUTO_INCREMENT = 1;
ALTER TABLE `flash_noti` AUTO_INCREMENT = 1;
ALTER TABLE `reports` AUTO_INCREMENT = 1;
ALTER TABLE `airtimetokens` AUTO_INCREMENT = 1;
ALTER TABLE `airtimepinstock` AUTO_INCREMENT = 1;
ALTER TABLE `datatokens` AUTO_INCREMENT = 1;
ALTER TABLE `datapins` AUTO_INCREMENT = 1;
ALTER TABLE `monnify_accounts` AUTO_INCREMENT = 1;
ALTER TABLE `billstack_accounts` AUTO_INCREMENT = 1;
ALTER TABLE `strowallet_accounts` AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

-- ============================================================
-- Done. All users and their related data have been removed.
-- The admin accounts (sysusers) are preserved.
-- ============================================================
