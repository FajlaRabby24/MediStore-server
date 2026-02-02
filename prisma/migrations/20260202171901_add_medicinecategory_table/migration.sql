-- DropIndex
DROP INDEX "medicines_seller_id_idx";

-- AlterTable
ALTER TABLE "medicines" ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "medicine-category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine-category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicine-category_name_idx" ON "medicine-category"("name");

-- CreateIndex
CREATE INDEX "medicines_seller_id_category_id_idx" ON "medicines"("seller_id", "category_id");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "medicine-category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
