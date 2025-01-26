import { Router } from "express";
import type { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../index";
import dotenv from "dotenv";
import { generatePropmt } from "../prompt";
import bcrypt from "bcryptjs";

dotenv.config();
const router = Router();
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error(
    "Google API key is missing. Please set GOOGLE_API_KEY in the environment."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function generate(): Promise<string> {

//   const prompt = basePrompt
//   const result = await model.generateContent(prompt);
//   // console.log(result.response);
//   return result.response.text();
// }

// Route to generate and return the weekly timetable
router.post("/generate", async (req: Request, res: Response) => {
  let data = await req.body;
  try {
    let prompt = generatePropmt(data);
   
    let timetable = await model
      .generateContent(prompt)
      .then((result) => result.response.text());
    timetable = timetable.replace(/```json|```/g, "").trim();
    const timetableJSON = JSON.parse(timetable);
   
    for (const [day, slot] of Object.entries(timetableJSON)) {
      // console.log(day, slot);
      await prisma.timeTable.upsert({
        where: { day },
        update: {},
        create: { day },
      });

      await prisma.slot.deleteMany({ where: { timeTableId: day } }); // Clear existing slots for the day
      const slotPromises = (slot as any[]).map(async (s) => {
        try {
          await prisma.slot.create({
            data: {
              teacher: s.teacher ?? "N/A",
              subject: s.subject,
              start_time: s.start_time, // Ensure valid DateTime
              end_time: s.end_time, // Ensure valid DateTime
              room: s.room ?? "N/A",
              timeTableId: day,
            },
          });
        } catch (err) {
          console.error(`Failed to create slot for day ${day}:`, err);
        }
      });
      await Promise.all(slotPromises);
    }
    res.status(200).json({
      status: "success",
      message: "Timetable generated successfully",
      timetableJSON,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate timetable. Please try again later.",
    });
  }
});
router.post("/addTeacher",async (req: Request, res: any) => {
  let data = req.body
  try{
    await prisma.teacher.upsert({
      where:{
        username:data.username
      },
      update:{
        subjects: data.subjects
      },
      create:{
        username:data.username,
        subjects: data.subjects,
        role: "TEACHER",
        password: bcrypt.hashSync(data.password,10),
        name:data.name,
        isAvailable:true
      }
    })
    return res.status(200).json({
      status:"success",
      message:"Teacher added successfully"
    })
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      status:"error",
      message:"Failed to add teacher"
    })
  }
})

router.get("/clearTimetable", async (_req: Request, res: any) => {
  try{
    let result =await prisma.$transaction([
      prisma.slot.deleteMany({}),
      prisma.timeTable.deleteMany({})
    ])
    if (result){
      return res.status(200).json({
        status:"success",
        message:"Timetable cleared successfully"
      })
    }
  }catch(e){
    console.log(e)
    return res.status(500).json({
      status:"error",
      message:"Failed to clear timetable"
    })
  }
})

router.get("/getTeachers", async (_req: Request, res: any) => {
  try{
    let teachers = await prisma.teacher.findMany({
      select:{
        name:true,
        username:true,
        subjects:true,
        isAvailable:true
      }
    })
    if(teachers){
      return res.status(200).json({
        status:"success",
        message:"Teachers fetched successfully",
        teachers
      })
    }
    return res.status(500).json({
      status:"error",
      message:"Failed to fetch teachers"
    })
  }catch(e){
    console.log(e)
    return res.status(500).json({
      status:"error",
      message:"Failed to fetch teachers"
    })
  }
})

export default router;
