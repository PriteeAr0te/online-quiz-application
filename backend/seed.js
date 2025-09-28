const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const quizModelModule = require(path.join(__dirname, "dist", "models", "Quiz.js"));
const Quiz = quizModelModule.default || quizModelModule;

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error("Please provide MONGO_URL in the environment variables");
}

async function seedQuestions() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");

    const data = fs.readFileSync(path.join(__dirname, "src", "questions.json"), "utf-8");
    const categories = JSON.parse(data);

    const quizzes = categories.map((cat) => ({
      category: cat.category,
      title: cat.title,
      questions: cat.questions.map((q) => ({
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      })),
    }));

    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);

    console.log("Quizzes seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedQuestions();
