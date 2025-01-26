import express from 'express';
import authRouter from './routes/auth';  // Assuming your router file is named 'auth.ts'
import adminRouter from './routes/admin';  // Assuming your router file is named 'timetable.ts'\
import commonRouter from './routes/common';
import teacherRouter from './routes/teachers';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
const host = process.env.HOST ?? 'http://localhost';
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();
const app = express();
dotenv.config();
// Middleware to parse JSON bodies
let options: cors.CorsOptions = {
  origin: ['https://time-table-schedular-frontend.vercel.app','http://localhost:5173'], // Allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}
app.use(express.json());
app.use(cors(options));

// Register the router for /auth routes
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use("/",commonRouter);
app.use("/teacher",teacherRouter);
app.listen(port,() => {
  console.log(`Server is running at ${host}:${port}`);
});
