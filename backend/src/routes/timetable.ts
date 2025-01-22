import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
import { generatePropmt } from "../prompt";
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

export default router;
