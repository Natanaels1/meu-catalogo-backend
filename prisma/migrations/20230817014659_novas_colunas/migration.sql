/*
  Warnings:

  - Added the required column `idEmpresa` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj_cpf` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admins` ADD COLUMN `idEmpresa` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `empresas` ADD COLUMN `cnpj_cpf` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idEmpresa` INTEGER NOT NULL,

    UNIQUE INDEX `categorias_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `idCategoria` INTEGER NOT NULL,
    `vlProduto` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `flAtivo` BOOLEAN NOT NULL DEFAULT true,
    `idEmpresa` INTEGER NOT NULL,
    `flProdutoDestaque` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `produtos_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `idProduto` INTEGER NOT NULL,

    UNIQUE INDEX `files_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `admins_idEmpresa_fkey` FOREIGN KEY (`idEmpresa`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorias` ADD CONSTRAINT `categorias_idEmpresa_fkey` FOREIGN KEY (`idEmpresa`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_idEmpresa_fkey` FOREIGN KEY (`idEmpresa`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_idProduto_fkey` FOREIGN KEY (`idProduto`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
