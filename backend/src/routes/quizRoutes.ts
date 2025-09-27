import express from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController';

const router = express.Router();

router.get("/", getQuiz);
router.post("/submit", submitQuiz);

export default router;