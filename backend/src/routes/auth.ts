import { Router } from 'express';

const router = Router();

const data = [
  { id: 1, name: "John", username: "john", password: "123456", role: "teacher" },
  { id: 2, name: "Jane", username: "jane", password: "123456", role: "student" },
  { id: 3, name: "Tom", username: "tom", password: "123456", role: "admin" }
];

router.post("/login", async(req: any, res:any) => {
  const { username, password, role } = req.body;

  // Check the credentials
  const user = data.find(
    (user) => user.username === username && user.password === password && user.role === role
  );

  if (user) {
    return res.send("Login successful");
  }

  return res.send("Invalid username or password");
});

export default router;
