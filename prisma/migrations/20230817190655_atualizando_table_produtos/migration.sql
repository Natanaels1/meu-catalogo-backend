/*
  Warnings:

  - Added the required column `qntdProdutosDisponiveis` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `flProntaEntrega` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `qntdProdutosDisponiveis` INTEGER NOT NULL;
