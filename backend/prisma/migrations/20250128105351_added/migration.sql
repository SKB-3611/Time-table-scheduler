-- CreateTable
CREATE TABLE "RelacementSlot" (
    "id" TEXT NOT NULL,
    "originalTeacher" TEXT NOT NULL,
    "replacementTeacher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timeTableId" TEXT NOT NULL,

    CONSTRAINT "RelacementSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RelacementSlot" ADD CONSTRAINT "RelacementSlot_timeTableId_fkey" FOREIGN KEY ("timeTableId") REFERENCES "TimeTable"("day") ON DELETE CASCADE ON UPDATE CASCADE;
