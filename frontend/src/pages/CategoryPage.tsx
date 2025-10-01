import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import type { Quiz } from "../types/category";
import API from "../lib/api";
import Spinner from "../components/Spinner";
import StartQuizModal from "../components/StartQuizModal";


const CategoryPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const navigate = useNavigate();
  const [startOpen, setStartOpen] = useState(false);
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null);
  const [pendingQuizTitle, setPendingQuizTitle] = useState<string>("");
  const [pendingQuizTotal, setPendingQuizTotal] = useState<number>(0);

  useEffect(() => {
    const fetchQuizes = async () => {
      setLoading(true);
      const res = await API.get(`/category/${encodeURIComponent(category ?? "")}`);
      console.log(res.data);
      setQuizzes(res.data.quizzes)
      setLoading(false);
    }
    fetchQuizes()

  }, [category]);

  useEffect(() => {
    if (category) document.title = `${category} | Quizzes`;
    else document.title = "Quizzes";
  }, [category]);

  return (
    <>

      <main id="main-content" className="w-full h-full" role="main">
        <div className="w-full bg-dark-bg text-white py-3 px-3 sm:px-6 md:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                aria-label="Home"
                className="px-2 py-1.5 rounded hover:bg-white/10 focus:border-0 focus:outline-dark-bg flex gap-2 items-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Home size={20} /> <span className="hidden sm:block text-white">Home</span>
              </button>
            </div>
            <h1 className="font-semibold text-2xl sm:text-3xl xl:text-4xl text-center flex-1">
              {category}
            </h1>
            <div className="w-[60px]" />
          </div>
        </div>

        <section className="w-full max-w-7xl p-3 mx-auto h-full mt-5 sm:mt-6 lg:mt-10 mb-8">
          <button
            className="px-3 py-1.5 rounded-lg bg-background hover:bg-gray-200 flex gap-1 items-center mb-8 cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={20} /> <span>Back</span>
          </button>
          <div className="space-y-5">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white text-dark-bg p-6 md:p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-y-5 md:gap-4 items-center justify-between border-2 border-white hover:border-primary-dark hover:shadow-lg transition-all duration-300 ease-in-out focus:border-dark-bg focus:outline-none" role="article" aria-labelledby={`quiz-title-${quiz._id}`}>
                  <div>
                    <h2 id={`quiz-title-${quiz._id}`} className="font-semibold text-lg text-center md:text-left">{quiz.title}</h2>
                    <p className="font-medium text-center md:text-left">{quiz.questions.length} Questions</p>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        try {
                          const stored = localStorage.getItem(`quizResult:${quiz._id}`);
                          if (stored) {
                            navigate(`/result/${quiz._id}`, { state: JSON.parse(stored) });
                            return;
                          }
                        } catch (err) {
                          console.warn('Failed to read stored quiz result', err);
                        }

                        setPendingQuizId(quiz._id);
                        setPendingQuizTitle(quiz.title);
                        setPendingQuizTotal(quiz.questions.length);
                        setStartOpen(true);
                      }}
                      aria-label={`Start quiz: ${quiz.title}`}
                      className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg cursor-pointer focus:outline-2 focus:outline-dark-bg focus:ring-0 focus:border-0"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        {startOpen && (
          <StartQuizModal
            open={startOpen}
            onClose={() => setStartOpen(false)}
            onStart={() => {
              setStartOpen(false);
              if (pendingQuizId) navigate(`/quiz/${pendingQuizId}`);
            }}
            title={pendingQuizTitle}
            totalQuestions={pendingQuizTotal}
          />
        )}
      </main>
    </>
  )
}

export default CategoryPage