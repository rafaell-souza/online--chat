-- DropForeignKey
ALTER TABLE `chatuser` DROP FOREIGN KEY `ChatUser_chatId_fkey`;

-- AddForeignKey
ALTER TABLE `ChatUser` ADD CONSTRAINT `ChatUser_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
