-- CreateEnum
CREATE TYPE "RolesName" AS ENUM ('USER', 'SELLER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'USER',
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "role" "RolesName" NOT NULL DEFAULT 'USER',

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
