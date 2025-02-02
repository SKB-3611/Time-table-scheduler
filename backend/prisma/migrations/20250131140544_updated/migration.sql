/*
  Warnings:

  - You are about to drop the column `replacement` on the `Teacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId]` on the table `ReplacementLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `ReplacementLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `replacementLogId` on table `ReplacementSlot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isAvailable` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ReplacementSlot" DROP CONSTRAINT "ReplacementSlot_replacementLogId_fkey";

-- AlterTable
ALTER TABLE "ReplacementLog" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReplacementSlot" ALTER COLUMN "replacementLogId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "replacement",
ALTER COLUMN "isAvailable" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReplacementLog_teacherId_key" ON "ReplacementLog"("teacherId");

-- AddForeignKey
ALTER TABLE "ReplacementLog" ADD CONSTRAINT "ReplacementLog_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplacementSlot" ADD CONSTRAINT "ReplacementSlot_replacementLogId_fkey" FOREIGN KEY ("replacementLogId") REFERENCES "ReplacementLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
