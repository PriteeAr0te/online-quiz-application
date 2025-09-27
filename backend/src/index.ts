import express, { Application } from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();

const app:Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/quiz", require("./routes/quiz"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));