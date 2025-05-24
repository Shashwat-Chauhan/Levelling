import express from 'express';
import cors from 'cors';
import connectDb from './db.js';
import dotenv from 'dotenv';
import userRoutes from './routers/userRoutes.js';
import taskRoutes from './routers/taskRoutes.js';

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use routers correctly
app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.listen(process.env.PORT || 5050, () => {
  console.log("🚀 Server is running on port 5000");
});
