/*
  Warnings:

  - You are about to drop the `RelacementSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RelacementSlot" DROP CONSTRAINT "RelacementSlot_timeTableId_fkey";

-- DropTable
DROP TABLE "RelacementSlot";

-- CreateTable
CREATE TABLE "ReplacementSlot" (
    "id" TEXT NOT NULL,
    "originalTeacher" TEXT NOT NULL,
    "replacementTeacher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "replacementLogId" TEXT,

    CONSTRAINT "ReplacementSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplacementLog" (
    "id" TEXT NOT NULL,
    "originalTeacher" TEXT NOT NULL,
    "replacementTeacher" TEXT NOT NULL,

    CONSTRAINT "ReplacementLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReplacementSlot" ADD CONSTRAINT "ReplacementSlot_replacementLogId_fkey" FOREIGN KEY ("replacementLogId") REFERENCES "ReplacementLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
