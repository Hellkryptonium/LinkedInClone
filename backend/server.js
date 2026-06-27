import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postsRoutes from "./routes/posts.routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(postsRoutes);

app.use(express.json());

const start = async () => {
  const connectDB = await mongoose.connect(process.env.MONGO_URI);

  app.listen(9090, () => {
    console.log("Server is listening on port 9090");
  });
};

start();
