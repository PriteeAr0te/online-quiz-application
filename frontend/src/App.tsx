import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import Spinner from "./components/Spinner"

const Home = lazy(() => import('./pages/Home'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))

function App() {

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-primary text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>
      <div className="min-h-screen w-screen bg-light">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            <Route path="/result/:id" element={<ResultPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
