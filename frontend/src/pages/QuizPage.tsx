import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Home } from "lucide-react"
import type { Quiz } from "../types/category"
import API from "../lib/api"
import Spinner from "../components/Spinner"
import SubmitQuizModal from "../components/SubmitQuizModal"

const QuizPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answer, setAnswer] = useState<Record<string, number | undefined>>({});
    const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitQuizModal, setIsSubmitQuizModal] = useState(false);

    const [startTime, setStartTime] = useState<string | null>(null);
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        if (!id) return;
        const stored = localStorage.getItem(`quizResult:${id}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                navigate(`/result/${id}`, { replace: true, state: parsed });
                return;
            } catch {
                // ignore parse errors and continue normal flow
            }
        }
    }, [id, navigate]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const res = await API.get(`/${id}`)
            setQuiz(res.data.quiz);
            setStartTime(new Date().toISOString());
            setLoading(false);
        }
        fetchQuestions()
    }, [id]);

    useEffect(() => {
        if (quiz) {
            document.title = `${quiz.title} | Quiz`;
        }
    }, [quiz]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTotalTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentQuestion = quiz?.questions[currentIndex];

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        setAnswer((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleMarkedForReview = () => {
        if (!currentQuestion) return;
        setReviewMarked((prev) => ({
            ...prev,
            [currentQuestion._id]: !prev[currentQuestion._id]
        }));

        handleNext();
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    }

    const handleNext = () => {
        if (quiz && currentIndex < quiz.questions.length - 1)
            setCurrentIndex((prev) => prev + 1);
    }

    const handleJumpTo = (index: number) => {
        setCurrentIndex(index);
    };

    const handleSubmit = () => {
        if (!quiz) return;
        setIsSubmitQuizModal(true);
    }

    const submitExam = async () => {
        if (!quiz) return;
        const end = new Date().toISOString();

        try {
            const res = await API.post(`/${id}/submit`, {
                answers: answer,
                startTime,
                endTime: end,
                totalTime
            });

            try {
                if (id) localStorage.setItem(`quizResult:${id}`, JSON.stringify(res.data));
            } catch (e) {
                console.warn('Failed to persist quiz result to localStorage', e);
            }

            navigate(`/result/${id}`, { state: res.data });
        } catch (error) {
            console.log(error);
        }
    }

    if (loading || !quiz) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            {isSubmitQuizModal && (
                <SubmitQuizModal
                    open={isSubmitQuizModal}
                    onClose={() => setIsSubmitQuizModal(false)}
                    onConfirm={() => { setIsSubmitQuizModal(false); submitExam(); }}
                />
            )}

            <main id="main-content" className="w-full h-full" role="main">
                <div className="w-full bg-dark-bg text-white py-3 px-3 sm:px-6 md:px-8 lg:px-10 mb-8">
                    <h1 className="block md:hidden mb-2 font-semibold text-2xl sm:text-3xl text-center flex-1">
                        {quiz.title}
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
                            {quiz.title}
                        </h1>
                        <div className="font-semibold whitespace-nowrap w-[100px] text-center text-lg" aria-live="polite" aria-atomic="true" aria-label="Elapsed time">
                            {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, "0")}
                        </div>
                    </div>
                </div>

                <section className="w-full max-w-7xl p-3 mx-auto mb-8">
                    <button
                        className="px-3 py-1.5 rounded-lg bg-background hover:bg-gray-200 flex gap-1 items-center mb-8 cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} /> <span>Back</span>
                    </button>
                    {currentQuestion && (
                        <div className="w-full flex gap-5 flex-col gap-y-6 lg:flex-row items-center">
                            <div className="w-full max-w-[70%] font-rubik">
                                <h2 className="text-lg xl:text-xl font-semibold mb-4">
                                    Q{currentIndex + 1}. {currentQuestion.text}
                                </h2>
                                <ul>
                                    {currentQuestion.options.map((opt: string, idx: number) => {
                                        const selected = answer[currentQuestion._id] === idx;
                                        return (
                                            <li key={idx} className="mb-2.5">
                                                <button
                                                    type="button"
                                                    className={`w-full text-left lg:text-lg border border-[#D0D5DD] p-2 rounded-lg cursor-pointer ${selected ? "bg-accent/90" : "bg-white"} focus-visible:outline focus-visible:outline-dark-bg`}
                                                    aria-pressed={selected}
                                                    aria-label={`Option ${idx + 1}: ${opt}`}
                                                    onClick={() => handleOptionSelect(currentQuestion._id, idx)}
                                                >
                                                    {opt}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>


                            <div className="w-full lg:max-w-[28%] flex justify-center lg:justify-end flex-col items-center lg:items-end mt-6">
                                <div className="p-6 bg-background rounded-lg">
                                    <div className="flex gap-4 mb-2">
                                        <span className="text-green-600">■ Solved</span>
                                        <span className="text-red-600">■ Unsolved</span>
                                        <span className="text-blue-600">■ Review</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 mt-3 w-full justify-center" role="navigation" aria-label="Question navigation">
                                        {quiz.questions.map((q, index) => {
                                            let color = "bg-secondary";
                                            if (answer[q._id] !== undefined) color = "bg-green-600";
                                            if (reviewMarked[q._id]) color = "bg-blue-400";
                                            return (
                                                <button
                                                    key={q._id}
                                                    type="button"
                                                    className={`${color} text-white p-2 text-center cursor-pointer rounded focus-visible:outline focus-visible:outline-dark-bg w-[42px] h-[42px]`}
                                                    onClick={() => handleJumpTo(index)}
                                                    aria-current={index === currentIndex}
                                                    aria-label={`Go to question ${index + 1}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center gap-2 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-20 mt-8">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            aria-label="Previous question"
                            className="bg-primary text-white font-semibold px-4 py-2 rounded-lg cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <button
                            onClick={handleMarkedForReview} aria-label="Mark question for review"
                            className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
                        >
                            {reviewMarked[currentQuestion?._id ?? ""] ? "Unmark Review" : "Mark for Review"}
                        </button>
                        {currentIndex === quiz.questions.length - 1 ? (
                            <button onClick={handleSubmit} aria-label="Submit quiz" className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0">Submit</button>
                        ) : (
                            <button
                                onClick={handleNext}
                                aria-label="Next question"
                                className="bg-primary text-white font-semibold px-4 py-2 rounded-lg cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0 disabled:cursor-not-allowed"
                            >Next</button>
                        )}
                    </div>

                </section>

            </main>
        </>
    )
};

export default QuizPage;
