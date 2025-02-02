import { Router } from "express";
import { prisma } from "../index";
const router = Router();

router.get("/timetable", async (_req: any, res: any) => {
  try {
    let timetable = await prisma.timeTable.findMany({
      include: {
        slots: true,
      },
    });
    console.dir(timetable, { depth: null });
    let teachers = await prisma.teacher.findMany({
      where: {
        isAvailable: false,
      },
      include: {
        replacementLog: true,
      },
    });
    if (!teachers)
      return timetable
        ? res.status(200).json({
            status: "success",
            timetable,
          })
        : res.status(404).json({
            status: "error",
            message: "Timetable not found",
          });

    if (teachers) {
      let replacementSlots = await prisma.$transaction(async (tx) => {
        let replacementslots = await Promise.all(
          teachers.map(async (teacher) => {
            let logs = teacher.replacementLog || [];
      
            let slots = await Promise.all(
              logs.map(async (log) => {
                return tx.replacementSlot.findMany({
                  where: { replacementLogId: log.id },
                });
              })
            );
      
            return slots.flat(); // Flatten the array of arrays
          })
        );
      
        return replacementslots.flat(); // Flatten the final result
      });
      
      return timetable
        ? res.status(200).json({
            status: "success",
            timetable,
            replacementSlots,
          })
        : res.status(404).json({
            status: "error",
            message: "Timetable not found",
          });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch timetable",
    });
  }
});

export default router;
