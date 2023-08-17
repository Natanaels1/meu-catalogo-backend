/*
  Warnings:

  - You are about to drop the column `idEmpresa` on the `admins` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `admins_idEmpresa_fkey`;

-- AlterTable
ALTER TABLE `admins` DROP COLUMN `idEmpresa`;
