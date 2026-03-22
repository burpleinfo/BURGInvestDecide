
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || "";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Backend is running with MongoDB!");
});

mongoose.set("bufferCommands", false);

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  if (!mongoURI) {
    console.error("MongoDB connection string is missing. Check MONGO_URI/MONGODB_URI/MONGO_URL.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();