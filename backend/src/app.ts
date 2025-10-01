import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use("/api/quiz", quizRoutes);

export default app;
