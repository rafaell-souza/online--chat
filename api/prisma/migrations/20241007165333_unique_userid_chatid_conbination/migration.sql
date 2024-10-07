/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `ChatBlackList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ChatBlackList_userId_chatId_key` ON `ChatBlackList`(`userId`, `chatId`);
