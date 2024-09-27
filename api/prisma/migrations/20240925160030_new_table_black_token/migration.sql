-- CreateTable
CREATE TABLE `BlackToken` (
    `id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(500) NOT NULL,

    UNIQUE INDEX `BlackToken_id_key`(`id`),
    UNIQUE INDEX `BlackToken_token_key`(`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
