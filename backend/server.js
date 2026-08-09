import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postsRoutes);
app.use(userRoutes);


const start = async () => {
  const connectDB = await mongoose.connect(process.env.MONGO_URI);

  app.listen(9090, () => {
    console.log("Server is listening on port 9090");
  });
};

start();
