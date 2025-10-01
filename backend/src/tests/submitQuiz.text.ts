import Quiz from "models/Quiz";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

const MONGO_URI = process.env.MONGO_URI!;

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    await Quiz.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("POST /api/quiz/:id/submit", () => {
    let quizId: string;

    beforeAll(async () => {
        const quiz = await Quiz.create({
            category: "Math",
            title: "Test Quiz",
            questions: [
                {
                    text: "What is 2 + 2?",
                    options: ["4", "5", "6", "7"],
                    correctIndex: 0,
                },
                {
                    text: "What is 3 + 3?",
                    options: ["6", "7", "8", "9"],
                    correctIndex: 0,
                },
            ],
        });

        quizId = quiz?._id?.toString()!;
    });

    it("should return score for valid answers", async () => {
        const response = await request(app).post(`/api/quiz/${quizId}/submit`).send({
            answers: { [String(quizId)]: 1 },
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("score");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("results");
    });

    it("should return 400 for invalid quiz ID", async () => {
        const res = await request(app).post("/api/quiz/123/submit").send({ answers: {} });
        expect(res.status).toBe(400);
      });
})