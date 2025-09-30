import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Check, Home, X } from "lucide-react"
import type { QuizResult } from "../types/category";


const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const data = location.state as QuizResult | null;
    const [storedData, setStoredData] = useState<QuizResult | null>(null);

    // If navigated directly or after a refresh without state, load from localStorage
    useEffect(() => {
        if (!data && id) {
            try {
                const raw = localStorage.getItem(`quizResult:${id}`);
                if (raw) setStoredData(JSON.parse(raw) as QuizResult);
            } catch (e) {
                console.warn('Failed to load stored quiz result', e);
            }
        }
    }, [data, id]);

    const finalData = data ?? storedData;

    useEffect(() => {
        document.title = data ? `Result | Quiz` : `Result | Quiz`;
    }, [data]);

    if (!finalData) {
        return (
            <main id="main-content" className="w-full h-full" role="main">
                <div className="w-full bg-dark-bg text-white py-3 px-3 sm:px-6 md:px-8 lg:px-10 mb-8">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Home"
                                className="px-2 py-1.5 rounded hover:bg-white/10 focus:border-0 focus:outline-dark-bg flex gap-2 items-center cursor-pointer"
                                onClick={() => navigate("/")}
                            >
                                <Home size={20} /> <span className="hidden sm:block text-white">Home</span>
                            </button>
                        </div>
                        <h1 className="font-semibold text-2xl sm:text-3xl text-center flex-1">
                            Result
                        </h1>
                    </div>
                </div>

                <div className="w-full p-3">
                    <button
                        className="px-3 py-1.5 rounded-lg bg-background hover:bg-gray-200 flex gap-1 items-center mb-8 cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} /> <span>Back</span>
                    </button>

                    <p>No result data found. Please take a quiz first.</p>
                    <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Home</button>
                </div>
            </main>
        );
    }

    const { score, total, timeTaken, results } = finalData;

    return (
        <main id="main-content" className="w-full h-full" role="main">
            <div className="w-full bg-dark-bg text-white py-3 px-3 sm:px-6 md:px-8 lg:px-10 mb-8">
                <h1 className="block md:hidden mb-2 font-semibold text-2xl sm:text-3xl text-center flex-1">
                    Result
                </h1>

                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Home"
                            className="px-2 py-1.5 rounded hover:bg-white/10 focus:border-0 focus:outline-dark-bg flex gap-2 items-center cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            <Home size={20} /> <span className="hidden sm:block text-white">Home</span>
                        </button>
                    </div>
                    <h1 className="hidden md:block font-semibold text-2xl sm:text-3xl text-center flex-1">
                        Result
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto h-full mt-5 p-3 mb-6">
                <button
                    className="px-3 py-1.5 rounded-lg bg-background hover:bg-gray-200 flex gap-1 items-center mb-2 cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} /> <span>Back</span>
                </button>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <p className="text-lg font-semibold text-dark-bg">Score: {score} / {total}</p>
                    <p className="mb-6 text-lg font-semibold text-dark-bg">Time Taken: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s</p>
                </div>

                {results.map((result, idx) => (
                    <div key={result.questionId} className="mb-6 border border-[#D0D5DD] p-4 rounded-lg">
                        <h2 className="font-semibold mb-2">
                            Q{idx + 1}. {result.questionText}
                        </h2>
                        <ul>
                            {result.options.map((opt, i) => {
                                const isChosen = result.chosen === i;
                                const noChoiceMade = result.chosen === undefined || result.chosen === null;
                                const isCorrectChoice = isChosen && i === result.correctIndex;
                                const isWrongChoice = isChosen && i !== result.correctIndex;
                                const isCorrectUnchosen = noChoiceMade && i === result.correctIndex;
                                const userWasWrong = result.chosen !== undefined && result.chosen !== null && result.chosen !== result.correctIndex;

                                const bgClass = isCorrectChoice
                                    ? "bg-green-600 text-white"
                                    : isWrongChoice
                                        ? "bg-red-200"
                                        : userWasWrong && i === result.correctIndex
                                            ? 'bg-accent'
                                            : isCorrectUnchosen
                                                ? "bg-accent"
                                                : "bg-background/50";

                                return (
                                    <li key={i} className={`p-2 flex gap-2 items-center rounded mb-1 ${bgClass}`}>
                                        {opt}
                                        {isCorrectChoice && <Check className="" />}
                                        {isWrongChoice && <X className="text-red-500" />}
                                        {userWasWrong && i === result.correctIndex && (
                                            <span className="ml-2 font-medium text-green-700">(Correct answer)</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default ResultPage