/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `health_insurances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "health_insurances_name_key" ON "health_insurances"("name");
