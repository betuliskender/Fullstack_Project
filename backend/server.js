import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectUserDB } from "./db/dbConnection.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectUserDB();

app.get("/api", (req, res) => {
  res.send({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
