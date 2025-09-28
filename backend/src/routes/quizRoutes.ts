import express from 'express';
import { getAllCategories, getQuiz, getQuizByCategory, submitQuiz } from '../controllers/quizController';

const router = express.Router();

router.get("/api/quiz/:id", getQuiz);
router.post("/api/quiz/:id/submit", submitQuiz);
router.get("/api/categories", getAllCategories)
router.get("/api/quiz/category/:category", getQuizByCategory)

export default router;