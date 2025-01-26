/*
  Warnings:

  - You are about to drop the column `endTime` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `end_time` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "isAvailable" DROP NOT NULL;
