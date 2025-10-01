import { Request, Response } from "express";
import mongoose from "mongoose";
import Quiz, { IQuiz } from "../models/Quiz";
import { calculateScore } from "../scoring";


export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Quiz.aggregate([
            {
                $group: {
                    _id: '$category',
                    quizCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    quizCount: 1
                }
            }
        ]);

        if (categories.length === 0) {
            res.status(404).json({ message: 'No categories found.' })
            return;
        }

        res.status(200).json({ categories })
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const getQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        if (!mongoose.Types.ObjectId.isValid(id)) { res.status(400).json({ message: "Invalid quiz ID" }); return; }

        const quiz = await Quiz.findById(id).select("-questions.correctIndex").lean();
        if (!quiz) { res.status(404).json({ message: "Quiz not found" }); return; }

        res.status(200).json({ quiz });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        if (!mongoose.Types.ObjectId.isValid(id)) { res.status(400).json({ message: "Invalid quiz ID" }); return; }

        const { answers, startTime, endTime } = req.body as {
            answers: Record<string, number | undefined>;
            startTime?: string;
            endTime?: string;
        };

        const quiz = await Quiz.findById(id).lean() as IQuiz | null;
        if (!quiz) { res.status(404).json({ message: "Quiz not found" }); return; }

        const { score, total, results } = calculateScore(quiz.questions, answers)

        let timeTaken = 0;
        if (startTime && endTime) {
            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();
            if (!isNaN(start) && !isNaN(end) && end > start) {
                timeTaken = Math.floor((end - start) / 1000);
            }
        }

        res.status(200).json({
            score,
            total,
            timeTaken,
            results,
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const getQuizByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.params as { category: string };
        const quizzes = await Quiz.find({ category }).select("-questions.correctIndex").lean();

        if (quizzes.length === 0) { res.status(404).json({ message: "No quizzes found for this category" }); return; }

        res.status(200).json({ quizzes });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};
