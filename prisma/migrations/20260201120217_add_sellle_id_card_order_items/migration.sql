/*
  Warnings:

  - Added the required column `seller_id` to the `cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `order-items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart" ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order-items" ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
