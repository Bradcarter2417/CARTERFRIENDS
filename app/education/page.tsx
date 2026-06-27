import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { BookOpen, ArrowRight } from "lucide-react"

const articles = [
  {
    category: "Débutant",
    title: "Qu'est-ce que le minage de cryptomonnaies ?",
    excerpt:
      "Découvrez les bases du minage crypto : comment les transactions sont validées, quel matériel est utilisé et comment générer des revenus passifs.",
    readTime: "5 min",
    color: "#10b981",
  },
  {
    category: "Intermédiaire",
    title: "Bitcoin vs Ethereum : quelles différences pour les investisseurs ?",
    excerpt:
      "Analyse comparative des deux plus grandes cryptomonnaies du marché. Laquelle convient le mieux à votre stratégie d'investissement en Afrique ?",
    readTime: "8 min",
    color: "#f5c518",
  },
  {
    category: "Débutant",
    title: "Comment fonctionne l'USDT (Tether) ?",
    excerpt:
      "L'USDT est un stablecoin ancré sur le dollar américain. Apprenez pourquoi c'est la monnaie de référence des transactions crypto en Afrique.",
    readTime: "4 min",
    color: "#10b981",
  },
  {
    category: "Avancé",
    title: "Stratégies de diversification de portefeuille crypto",
    excerpt:
      "Comment répartir vos investissements entre différentes cryptomonnaies pour maximiser les gains tout en minimisant les risques.",
    readTime: "12 min",
    color: "#a8d5e2",
  },
  {
    category: "Juridique",
    title: "Cadre légal de l'investissement crypto en Afrique de l'Ouest",
    excerpt:
      "Notre avocat financier partenaire explique la réglementation actuelle des cryptomonnaies en Côte d'Ivoire, au Sénégal et au Cameroun.",
    readTime: "10 min",
    color: "#f5c518",
  },
  {
    category: "Intermédiaire",
    title: "Mobile Money et crypto : le duo gagnant en Afrique",
    excerpt:
      "Comment les paiements via Orange Money, MTN MoMo et Moov Money ont révolutionné l'accès aux cryptomonnaies pour des millions d'Africains.",
    readTime: "6 min",
    color: "#f5c518",
  },
]

const quizQuestions = [
  {
    question: "Qu'est-ce qu'une blockchain ?",
    answer:
      "Une blockchain est un registre distribué et immuable qui enregistre toutes les transactions de manière transparente et sécurisée.",
  },
  {
    question: "Pourquoi l'USDT est-il stable ?",
    answer:
      "L'USDT est un stablecoin adossé au dollar américain : pour chaque USDT émis, un dollar est conservé en réserve.",
  },
  {
    question: "Qu'est-ce que le halving Bitcoin ?",
    answer:
      "Le halving est un événement programmé qui divise par deux la récompense des mineurs, réduisant l'offre et influençant positivement le prix.",
  },
]

export default function EducationPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-full px-4 py-2 mb-6">
            <BookOpen size={14} className="text-[#f5c518]" />
            <span className="text-[#f5c518] text-sm font-medium">Centre d&apos;éducation financière</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-balance mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Apprenez, investissez, <span className="text-[#f5c518]">prospérez</span>
          </h1>
          <p className="text-[#888888] text-lg max-w-2xl">
            Des ressources pédagogiques conçues pour les investisseurs africains, du niveau débutant à avancé.
          </p>
        </div>

        {/* Articles grid */}
        <section className="mb-20">
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Articles & Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(({ category, title, excerpt, readTime, color }) => (
              <article
                key={title}
                className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#f5c518]/30 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${color}15`, color }}
                  >
                    {category}
                  </span>
                  <span className="text-[#555555] text-xs">{readTime} de lecture</span>
                </div>
                <h3
                  className="font-bold text-[#f5f5f5] mb-3 leading-snug flex-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p className="text-[#888888] text-sm leading-relaxed mb-5">{excerpt}</p>
                <button className="flex items-center gap-2 text-[#f5c518] text-sm font-medium hover:gap-3 transition-all">
                  Lire l&apos;article <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Quiz */}
        <section>
          <h2
            className="text-2xl font-bold mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Quiz — Testez vos connaissances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quizQuestions.map(({ question, answer }, i) => (
              <QuizCard key={question} num={i + 1} question={question} answer={answer} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}

function QuizCard({ num, question, answer }: { num: number; question: string; answer: string }) {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 group">
      <div className="w-8 h-8 rounded-full bg-[#f5c518]/10 flex items-center justify-center text-[#f5c518] font-bold text-sm mb-4">
        {num}
      </div>
      <h3
        className="font-bold text-[#f5f5f5] mb-4 leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {question}
      </h3>
      <details className="cursor-pointer">
        <summary className="text-[#f5c518] text-sm font-medium list-none select-none">
          Voir la réponse
        </summary>
        <p className="text-[#888888] text-sm leading-relaxed mt-3 pt-3 border-t border-[#2a2a2a]">
          {answer}
        </p>
      </details>
    </div>
  )
}
