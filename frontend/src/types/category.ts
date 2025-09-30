export interface Category {
    category: string;
    quizCount: number;
}

export interface Question {
    _id: string,
    text: string,
    options: string[],
    correctIndex: number
}

export interface Quiz {
    _id: string,
    category: string,
    title: string,
    questions: Question[]
}

export interface Result {
    questionId: string;
    questionText: string;
    options: string[];
    correctIndex: number;
    chosen?: number;
    isCorrect: boolean;
}

export interface QuizResult {
    score: number;
    total: number;
    timeTaken: number;
    results: Result[];
}