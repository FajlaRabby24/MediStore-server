/*
  Warnings:

  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status",
ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
