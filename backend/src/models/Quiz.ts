import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
    text: string;
    options: string[];
    correctIndex: number;
}

export interface IQuiz extends Document {
    category: string;
    title: string;
    questions: IQuestion[];
}

const QuestionSchema: Schema = new Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
});

const QuizSchema: Schema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    questions: [QuestionSchema],
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);