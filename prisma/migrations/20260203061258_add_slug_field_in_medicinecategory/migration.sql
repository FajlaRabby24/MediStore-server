/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `medicine-category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "medicine-category" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "medicine-category_slug_key" ON "medicine-category"("slug");
