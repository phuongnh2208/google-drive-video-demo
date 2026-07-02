-- AlterTable
ALTER TABLE `Video` ADD COLUMN `videoClass` ENUM('CLASS_A', 'CLASS_B') NULL;

-- Migrate legacy accessLevel mapping to explicit videoClass
UPDATE `Video` SET `videoClass` = 'CLASS_A' WHERE `accessLevel` = 'PRIVATE';
UPDATE `Video` SET `videoClass` = 'CLASS_B' WHERE `accessLevel` = 'ALLOWED';
