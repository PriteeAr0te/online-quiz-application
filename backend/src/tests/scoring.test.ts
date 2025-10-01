import { calculateScore } from "../scoring";
import { IQuestion } from "../models/Quiz";

const sampleQuestions = [
    {
        _id: "q1",
        text: "5 - 2 = ?",
        options: ["13", "3", "5", "6"],
        correctIndex: 1,
    },
    {
        _id: "q2",
        text: "3 + 5 = ?",
        options: ["18", "12", "3", "8"],
        correctIndex: 3,
    },
    {
        _id: "q3",
        text: "2 + 2 = ?",
        options: ["4", "12", "3", "4"],
        correctIndex: 0,
    },
    {
        _id: "q4",
        text: "2 * 2 = ?",
        options: ["4", "12", "3", "4"],
        correctIndex: 0,
    },
];

describe("calculateScore function", () => {
    it("should return 0 when no answer are correct", () => {
        const userAnswers = { "q1": 0, "q2": 1, "q3": 2, "q4": 3 };
        const { score, total, results } = calculateScore(sampleQuestions as unknown as IQuestion[], userAnswers);
        expect(score).toBe(0);
        expect(total).toBe(4);
        expect(results.every((result) => !result.isCorrect)).toBe(true);
    });

    it("should return full score when all answers are correct", () => {
        const userAnswers = { "q1": 1, "q2": 3, "q3": 0, "q4": 0 };
        const { score, total, results } = calculateScore(sampleQuestions as unknown as IQuestion[], userAnswers);
        expect(score).toBe(4);
        expect(total).toBe(4);
        expect(results.every((result) => result.isCorrect)).toBe(true);
    });

    it("should return correct partial score when some answers are correct", () => {
        const userAnswers = { "q1": 1, "q2": 3, "q3": 0, "q4": 1 };
        const { score, total, results } = calculateScore(sampleQuestions as unknown as IQuestion[], userAnswers);
        expect(score).toBe(3);
        expect(total).toBe(4);
        expect(results.find(result => result.questionId === "q4")?.isCorrect).toBe(false);
        expect(results.filter((result) => result.isCorrect).length).toBe(3);
    });

    it("should handle missing answers", () => {
        const userAnswers = { "q1": 1, "q2": 3, "q4": 1 };
        const { score, total, results } = calculateScore(sampleQuestions as unknown as IQuestion[], userAnswers);

        expect(score).toBe(2);
        expect(total).toBe(4);

        expect(results.find(result => result.questionId === "q3")?.chosen).toBe(undefined);

        results.filter(result => result.isCorrect).forEach(r => {
            expect(r.chosen).toBeDefined();
        });
    });
})