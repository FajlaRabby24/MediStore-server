/*
  Warnings:

  - You are about to drop the column `product_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order-items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,medicine_id]` on the table `cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medicine_id` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicine_id` to the `order-items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order-items" DROP CONSTRAINT "order-items_product_id_fkey";

-- DropIndex
DROP INDEX "cart_user_id_product_id_key";

-- DropIndex
DROP INDEX "order-items_order_id_product_id_idx";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "product_id",
ADD COLUMN     "medicine_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-items" DROP COLUMN "product_id",
ADD COLUMN     "medicine_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_medicine_id_key" ON "cart"("user_id", "medicine_id");

-- CreateIndex
CREATE INDEX "order-items_order_id_medicine_id_idx" ON "order-items"("order_id", "medicine_id");

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
