import { IQuestion } from './models/Quiz';

export function calculateScore(
    questions: IQuestion[],
    answers: Record<string, number | undefined>
) {
    let score = 0;
    const results = questions.map((question) => {
        const chosen = answers[question._id.toString()] ?? undefined;
        const isCorrect = chosen === question.correctIndex;
        if (isCorrect) score++;

        return {
            questionId: question._id.toString(),
            questionText: question.text,
            options: question.options,
            correctIndex: question.correctIndex,
            chosen,
            isCorrect,
        };
    });

    return {
        score,
        total: questions.length,
        results,
    }
}