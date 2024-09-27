/*
  Warnings:

  - You are about to alter the column `id` on the `blacktoken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(36)` to `Int`.

*/
-- DropIndex
DROP INDEX `BlackToken_id_key` ON `blacktoken`;

-- AlterTable
ALTER TABLE `blacktoken` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
