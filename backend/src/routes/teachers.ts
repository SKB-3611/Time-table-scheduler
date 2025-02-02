import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.post("/getSchedule", async (req: any, res: any) => {
    try {
      let { name, day } = req.body;
      
      if (!name || !day) {
        return res.status(400).json({ status: "error", message: "Missing name or day" });
      }
  
      const [schedule, replacementSlots] = await prisma.$transaction([
        prisma.slot.findMany({
          where: {
            teacher: name,
            timeTableId: day,
          },
        }),
        prisma.replacementSlot.findMany({
          where: {
            replacementTeacher: name,
          },
        }),
      ]);
      console.log(schedule,replacementSlots)
      if (schedule.length || replacementSlots.length) {
        return res.status(200).json({
          status: "success",
          schedule,
          replacementSlots,
        });
      }
      if(schedule.length == 0 && replacementSlots.length == 0){

          return res.status(200).json({
              status: "success",
              message: "No schedule found",
              schedule:[],
              replacementSlots:[]
            });
        }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to get schedule",
      });
    }
  });
  
export default router