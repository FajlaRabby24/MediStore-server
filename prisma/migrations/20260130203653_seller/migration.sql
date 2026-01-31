-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "shop_name" VARCHAR(100) NOT NULL,
    "license_no" VARCHAR(50) NOT NULL,
    "address" TEXT NOT NULL,
    "is_verified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_license_no_key" ON "Seller"("license_no");

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
