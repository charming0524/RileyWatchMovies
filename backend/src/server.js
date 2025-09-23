import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import movieRouter from "./routes/movies.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Basic route
app.get("/", (_req, res) => {
  res.json({
    success: true,
  });
});
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
