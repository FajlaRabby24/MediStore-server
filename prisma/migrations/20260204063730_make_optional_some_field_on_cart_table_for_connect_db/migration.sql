-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_medicine_id_fkey";

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "medicine_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
