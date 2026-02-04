/*
  Warnings:

  - Made the column `medicine_id` on table `cart` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_medicine_id_fkey";

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "medicine_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
