import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);

app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
