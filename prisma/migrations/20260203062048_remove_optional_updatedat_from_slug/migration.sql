/*
  Warnings:

  - Made the column `updated_at` on table `medicine-category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "medicine-category" ALTER COLUMN "updated_at" SET NOT NULL;
