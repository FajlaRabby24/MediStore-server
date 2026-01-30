-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_id_fkey";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
