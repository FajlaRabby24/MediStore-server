/*
  Warnings:

  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role_id",
ADD COLUMN     "role" "RolesName" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "roles";
