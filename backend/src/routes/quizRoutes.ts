import express from 'express';
import { getAllCategories, getQuiz, getQuizByCategory, submitQuiz } from '../controllers/quizController';

const router = express.Router();

router.get("/:id", getQuiz);
router.post("/:id/submit", submitQuiz);
router.get("/categories", getAllCategories)
router.get("/category/:category", getQuizByCategory)

export default router;