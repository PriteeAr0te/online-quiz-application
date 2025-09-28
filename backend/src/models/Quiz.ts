import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
    _id: mongoose.Types.ObjectId;
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
    options: { type: [String], required: true, validate: [(arr: string[]) => arr.length > 0, "Options cannot be empty"] },
    correctIndex: {
        type: Number,
        required: true,
        validate: {
            validator: function (this: IQuestion, value: number) {
                return this.options && value >= 0 && value < this.options.length;
            },
            message: "correctIndex must be a valid index of the options array",
        },
    },
});

const QuizSchema: Schema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true, validate: [(arr: IQuestion[]) => arr.length > 0, "Quiz must have at least one question"] },
}, { timestamps: true });

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
