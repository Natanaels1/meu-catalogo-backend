/*
  Warnings:

  - You are about to drop the column `idEmpresa` on the `admins` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `admins_idEmpresa_fkey` ON `admins`;

-- AlterTable
ALTER TABLE `admins` DROP COLUMN `idEmpresa`;
