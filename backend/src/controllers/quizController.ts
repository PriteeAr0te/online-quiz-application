import { Request, Response } from "express"
import Quiz from "../models/Quiz"
// import { IQuestion } from "../models/Quiz"

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
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" })
        }

        let score = 0;
        quiz.questions.forEach((question: any) => {  // remove any pending
            const choosen = answers[question._id]
            if (choosen !== undefined && choosen === question.correctIndex) {
                score++;
            }
        });

        res.status(200).json({ score, total: quiz.questions.length });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}