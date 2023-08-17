/*
  Warnings:

  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.
  - Added the required column `type` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qntdProdutosDisponiveis` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` DROP COLUMN `url`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `flProntaEntrega` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `qntdProdutosDisponiveis` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
