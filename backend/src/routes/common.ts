import { Router } from "express";
import { prisma } from "../index";
const router = Router();

router.get("/timetable",async (_req: any, res: any) => {
    try{
        let timetable = await prisma.timeTable.findMany({
            include:{
                slots:true
            }
        })
        return timetable? res.status(200).json({
            status:"success",
            timetable
        }):res.status(404).json({
            status:"error",
            message:"Timetable not found"
        })
    }catch(err){
        console.error(err)
        res.status(500).json({
            status:"error",
            message:"Failed to fetch timetable"
        })
    }
})

export default router