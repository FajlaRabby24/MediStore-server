/*
  Warnings:

  - Made the column `category_id` on table `medicines` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "medicines" DROP CONSTRAINT "medicines_category_id_fkey";

-- AlterTable
ALTER TABLE "medicines" ALTER COLUMN "category_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "medicine-category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
