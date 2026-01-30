-- CreateEnum
CREATE TYPE "RolesName" AS ENUM ('CUSTOMER', 'SELLER', 'ADMIN');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "role" "RolesName" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
