/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Thread_slug_key" ON "Thread"("slug");
