/*
  Warnings:

  - You are about to drop the column `status` on the `chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `chat` DROP COLUMN `status`;

-- CreateTable
CREATE TABLE `ChatBlackList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(36) NOT NULL,
    `chatId` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `ChatBlackList_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatBlackList` ADD CONSTRAINT `ChatBlackList_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
