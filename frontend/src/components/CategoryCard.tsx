import { Link } from "react-router-dom"
import type { Category } from "../types/category";
import HTMLImg from "../assets/img/html.png";
import CSSImg from "../assets/img/css.png";
import JavaScriptImg from "../assets/img/javascript.png";
import ReactImg from "../assets/img/react.png";
import NextImg from "../assets/img/next.png";
import TypeScriptImg from "../assets/img/typescript.png";
import NodeImg from "../assets/img/node.png";
import ExpressImg from "../assets/img/express.png";
import MongoDBImg from "../assets/img/mongodb.png";
import MYSQLImg from "../assets/img/mysql.png";
import CImg from "../assets/img/c.png";
import JavaImg from "../assets/img/java.png";
import PythonImg from "../assets/img/python.png";
import OOPImg from "../assets/img/oop.png";
import NetworkingImg from "../assets/img/networking.png";
import DatabasesImg from "../assets/img/database.png";
import MathematicsImg from "../assets/img/maths.png";
import GrammarImg from "../assets/img/grammar.png";
import AptitudeImg from "../assets/img/aptitude.png";
import DefaultImg from "../assets/img/exam.png";
import TailwindImg from "../assets/img/tailwind.png";

const categoryImages: Record<string, { img: string; color: string }> = {
  "HTML": {
    img: HTMLImg,
    color: 'from-red-500/85 to-orange-500/85'
  },
  "CSS": {
    img: CSSImg,
    color: 'from-orange-500/85 to-amber-500/85'
  },
  "JavaScript": {
    img: JavaScriptImg,
    color: 'from-amber-500/85 to-yellow-500/85'
  },
  "React.js": {
    img: ReactImg,
    color: 'from-yellow-500/85 to-lime-500/85'
  },
  "Next.js": {
    img: NextImg,
    color: 'from-lime-500/85 to-green-500/85'
  },
  "TypeScript": {
    img: TypeScriptImg,
    color: 'from-green-500/85 to-emerald-500/85'
  },
  "Node.js": {
    img: NodeImg,
    color: 'from-emerald-500/85 to-teal-500/85'
  },
  "Express.js": {
    img: ExpressImg,
    color: 'from-teal-500/85 to-cyan-500/85'
  },
  "MongoDB": {
    img: MongoDBImg,
    color: 'from-cyan-500/85 to-sky-500/85'
  },
  "MySQL": {
    img: MYSQLImg,
    color: 'from-sky-500/85 to-blue-500/85'
  },
  "C / C++": {
    img: CImg,
    color: 'from-blue-500/85 to-indigo-500/85'
  },
  "Java": {
    img: JavaImg,
    color: 'from-indigo-500/85 to-violet-500/85'
  },
  "Python": {
    img: PythonImg,
    color: 'from-violet-500/85 to-purple-500/85'
  },
  "OOP Concepts": {
    img: OOPImg,
    color: 'from-purple-500/85 to-fuchsia-500/85'
  },
  "Networking": {
    img: NetworkingImg,
    color: 'from-fuchsia-500/85 to-pink-500/85'
  },
  "Database": {
    img: DatabasesImg,
    color: 'from-pink-500/85 to-rose-500/85'
  },
  "Mathematics": {
    img: MathematicsImg,
    color: 'from-slate-500/85 to-gray-500/85'
  },
  "Grammar": {
    img: GrammarImg,
    color: 'from-gray-500/85 to-zinc-500/85'
  },
  "Aptitude/Logical Reasoning": {
    img: AptitudeImg,
    color: 'from-zinc-500/85 to-neutral-500/85'
  },
  "Tailwind CSS": {
    img: TailwindImg,
    color: 'from-neutral-500/85 to-stone-500/85'
  },
  default: {
    img: DefaultImg,
    color: 'from-orange-500/85 to-red-500/85'
  },
};

const CategoryCard = ({ category, quizCount }: Category) => {
  const { img, color } = categoryImages[category] || categoryImages.default;

  return (
    <Link
      to={`/category/${encodeURIComponent(category)}`}
      className={`rounded-xl p-4 cursor-pointer bg-gradient-to-br ${color} hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 relative group overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      <div className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-white/10"></div>
      <div className="relative z-10 text-center place-items-center">
        <img src={img} alt={category} className="w-16 bg-background h-16 mb-2 p-1 rounded-full" />
        <h2 className="text-xl text-white font-semibold">{category}</h2>
        <p className="text text-gray-100">{quizCount} Quizzes</p>
      </div>
    </Link>
  )
}

export default CategoryCard
