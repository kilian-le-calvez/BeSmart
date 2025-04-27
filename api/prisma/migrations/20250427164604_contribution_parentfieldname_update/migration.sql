/*
  Warnings:

  - You are about to drop the column `parentMessageId` on the `Contribution` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_parentMessageId_fkey";

-- AlterTable
ALTER TABLE "Contribution" DROP COLUMN "parentMessageId",
ADD COLUMN     "parentContributionId" TEXT;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_parentContributionId_fkey" FOREIGN KEY ("parentContributionId") REFERENCES "Contribution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
