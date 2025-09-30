import { useState, useEffect } from "react"
import CategoryCard from "../components/CategoryCard"
import API from "../lib/api";
import type { Category } from "../types/category";
import Spinner from "../components/Spinner";

const Home = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            const res = await API.get("/")
            setCategories(res.data.categories)
            setLoading(false);
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        document.title = "Online Quiz Application | Home";
    }, []);

    return (
        <main id="main-content" className="w-full h-full" role="main">
            <div className="w-full h-full bg-dark-bg text-white py-4 px-3 sm:px-6 md:px-8 lg:px-10 text-center">
                <h1 className="font-semibold text-4xl xl:text-5xl py-2">
                    Online Quiz Application
                </h1>
            </div>

            <div className="w-full max-w-7xl  mx-auto h-full mt-5 sm:mt-6 lg:mt-8 p-3 mb-6">

                <h2 className="text-3xl text-dark-bg font-semibold w-full text-center">
                    Test Your Knowledge & Sharpen Your Skills
                </h2>
                <p className="mt-4 text-lg text-center text-gray-800 max-w-2xl mx-auto">
                    Take quizzes across multiple categories, challenge yourself, and see how much you really know!
                    Track your progress and improve every day.
                </p>

                <div className="w-full h-full mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        categories.map((cat: Category) => (
                            <CategoryCard key={cat.category} category={cat.category} quizCount={cat.quizCount} />
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}

export default Home