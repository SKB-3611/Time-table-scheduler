import express from "express";
import authRouter from "./routes/auth"; // Assuming your router file is named 'auth.ts'
import adminRouter, { regenerate } from "./routes/admin"; // Assuming your router file is named 'timetable.ts'\
import commonRouter from "./routes/common";
import teacherRouter from "./routes/teachers";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { getRegenerationPrompt } from "./prompt";
import cors from "cors";
import cron from "node-cron";
const host = process.env.HOST ?? "http://localhost";
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();
const app = express();
dotenv.config();
// Middleware to parse JSON bodies
let options: cors.CorsOptions = {
  origin: [
    "https://time-table-schedular-frontend.vercel.app",
    "http://localhost:5173",
  ], // Allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(express.json());
app.use(cors(options));

// Register the router for /auth routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/", commonRouter);
app.use("/teacher", teacherRouter);
app.listen(port, () => {
  console.log(`Server is running at ${host}:${port}`);
});

const func = async () => {
  await prisma.$transaction(async(tx)=>{
    const replacementSlot = await tx.replacementSlot.deleteMany()
    const replacementLog = await tx.replacementLog.deleteMany()
    await Promise.all([replacementSlot,replacementLog])
  })
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let teachers = await prisma.teacher.findMany({
  });
  let notAvailableTr = teachers.filter((teacher) => teacher.isAvailable == false);
  let todaysTimeTable = await prisma.timeTable.findFirst({
    where: { day: days[new Date().getDay()] },
    include: { slots: true },
  });
  // console.log(teachers,todaysTimeTable);

  let slotsToBeReplaced:any[] = []
  todaysTimeTable?.slots.map(slot=>{
    notAvailableTr.forEach(teacher=>{
      // console.log("slot.teacger = ",slot.teacher,"teacher.username=",teacher.username , slot.teacher==teacher.username);
      if(slot.teacher==teacher.username){
        // console.log(slot)
        slotsToBeReplaced.push( slot)
      }
    })
  })
  console.log("teachers=",teachers,"not available=",notAvailableTr,"todaysTimeTable=",todaysTimeTable,"slotsToBeReplaced=",slotsToBeReplaced);
  let data={
    teachers:teachers,
    notAvailableTr:notAvailableTr,
    slotsToBeReplaced:slotsToBeReplaced,
    todaysTimeTable:todaysTimeTable
  }
  let prompt = getRegenerationPrompt(data)
  let res = await regenerate(prompt)
  console.dir(res,{depth:null})
  if(res.status == "success"){
    let updated_teachers:any[] = [] 
    res.updatedTeachers.forEach((teacher:any)=>{
      if(teacher.replacement){
        updated_teachers.push(teacher)
      }
    })
    await prisma.$transaction(async (tx) => {
      // Create replacement logs first, associating with teachers
      const replacementLogPromises = res.replacementLogs.map((log: {
        id: string;
        originalTeacher: string;
        replacementTeacher: string;
      }) => 
        tx.replacementLog.create({
          data: {
            id: log.id,
            originalTeacher: log.originalTeacher,
            replacementTeacher: log.replacementTeacher,
            teacher: {
              connect: { 
                username: log.originalTeacher
              }
            }
          }
        })
      );
    
      await Promise.all(replacementLogPromises);
    
      const replacementSlotPromises = res.replacementSlots.map((slot: {
        id: string;
        originalTeacher: string;
        replacementTeacher: string;
        subject: string;
        room: string;
        startTime: string;
        endTime: string;
        replacementLogId: string;
      }) =>
        tx.replacementSlot.create({
          data: {
            id: slot.id,
            originalTeacher: slot.originalTeacher,
            replacementTeacher: slot.replacementTeacher,
            subject: slot.subject,
            room: slot.room,
            startTime: slot.startTime,
            endTime: slot.endTime,
            replacementLogId: slot.replacementLogId,
          },
        })
      );
    
      await Promise.all(replacementSlotPromises);
    });
    
    
     
    console.log(updated_teachers)
  }
};
try{
  cron.schedule("30 3 * * *" , async ()=>{
    try{
      func();
    }catch(e){
      console.log(e)
    }
  })
}
catch(err){
 console.log(err);
}
