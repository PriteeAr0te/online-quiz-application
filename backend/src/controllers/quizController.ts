import { Request, Response } from "express"
import Quiz, { IQuestion, IQuiz } from "../models/Quiz"

export const getQuiz = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select("-questions.correctIndex")
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        res.status(200).json({ quiz });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const submitQuiz = async (req: Request, res: Response) => {
    try {
        const { answers, startTime, endTime } = req.body as {
            answers: Record<string, number>;
            startTime: string;
            endTime: string;
        };
        const quiz = await Quiz.findById(req.params.id) as IQuiz | null;
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        let score = 0;
        const results = quiz.questions.map((question: IQuestion) => {
            const chosen = answers[question._id.toString()]
            const isCorrect = chosen === question.correctIndex;
            if (isCorrect) {
                score++;
            }

            return {
                questionId: question._id,
                questionText: question.text,
                options: question.options,
                correctIndex: question.correctIndex,
                chosen,
                isCorrect,
            };
        });

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
            total: quiz.questions.length,
            timeTaken,
            results
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getQuizByCategory = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.find({ category: req.params.category }).select("-questions.correctIndex")
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        res.status(200).json({ quiz });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Quiz.distinct("category");
        if (!categories) {
            return res.status(404).json({ message: "Categories not found" })
        }

        res.status(200).json({ categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}