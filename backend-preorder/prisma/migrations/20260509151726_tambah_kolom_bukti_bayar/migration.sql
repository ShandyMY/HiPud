/*
  Warnings:

  - You are about to drop the column `dpAmount` on the `order` table. All the data in the column will be lost.
  - You are about to alter the column `totalAmount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `dpAmount`,
    ADD COLUMN `proofImage` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `totalAmount` DOUBLE NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';
