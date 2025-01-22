import express from 'express';
import authRouter from './routes/auth';  // Assuming your router file is named 'auth.ts'
import timetableRouter from './routes/timetable';  // Assuming your router file is named 'timetable.ts'
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();
const port = 3000;
dotenv.config();
// Middleware to parse JSON bodies

app.use(express.json());
app.use(cors());

// Register the router for /auth routes
app.use('/auth', authRouter);
app.use('/timetable', timetableRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
