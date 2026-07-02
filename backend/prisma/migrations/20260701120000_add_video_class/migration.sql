-- AlterTable
ALTER TABLE `AllowedEmail` ADD COLUMN `videoClass` ENUM('CLASS_A', 'CLASS_B') NOT NULL DEFAULT 'CLASS_A';
