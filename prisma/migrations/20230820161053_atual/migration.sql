/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `empresas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `empresas_name_key` ON `empresas`(`name`);
