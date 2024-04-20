-- AlterTable
ALTER TABLE `User` ADD COLUMN `currentRefreshToken` VARCHAR(191) NULL,
    ADD COLUMN `currentRefreshTokenExp` DATETIME(3) NULL;
