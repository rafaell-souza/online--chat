-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `chatuser` DROP FOREIGN KEY `ChatUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_chatId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatUser` ADD CONSTRAINT `ChatUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
