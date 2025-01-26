import { Router } from 'express';
import { prisma } from '../index';
import bcrypt from "bcryptjs"
const router = Router();

const data = [
  {
    username: 'student',
    password: 'student123',
    role: 'student',
  },
  
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
];

router.post("/login", async(req: any, res:any) => {
  const { username, password, role } = req.body;

  if(role == "teacher"){
    let user= await prisma.teacher.findUnique({
      where:{
        username:username,
      }
    })
  
    if(user){

      if(bcrypt.compareSync(password,user.password)){
        return res.status(200).json({
          status:"success",
          message:"Login successful",
          user:{username:user.username,role:user.role,isAvailable:user.isAvailable}
        });
      }
    }
    return res.status(401).json({
      status:"error",
      message:"Invalid username or password"
    });
  }
  // Check the credentials
  const user = data.find(
    (user) => user.username === username && user.password === password && user.role === role
  );

  if (user) {
    return res.status(200).json({
      status:"success",
      message:"Login successful",
      user:{username:user.username,role:user.role}
    });
  }

  return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
});

export default router;
