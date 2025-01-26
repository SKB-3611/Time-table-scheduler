import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.post("/getSchedule",async (req: any, res: any) => {
    try{
        let {name,day} = req.body
        let schedule = await prisma.slot.findMany({
            where:{
                teacher:name,
                timeTableId:day
            }
    })
    if(schedule){
        return res.status(200).json({
            status:"success",
            schedule
        })
    }
    return res.status(404).json({
        status:"error",
        message:"Schedule not found"
    })
    }catch(e){
        console.error(e)
        res.status(500).json({
            status:"error",
            message:"Failed to get schedule"
        })
    }
})
export default router