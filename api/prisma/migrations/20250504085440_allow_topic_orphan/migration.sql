-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_createdById_fkey";

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
