import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import quizRoutes from "./routes/quizRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());

app.use("/api/quiz", quizRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));