import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"
import { TrendingUp, ShieldCheck, Zap, Globe, ArrowRight, Star } from "lucide-react"

const stats = [
  { value: "12 000+", label: "Investisseurs actifs" },
  { value: "98.7%",   label: "Taux de satisfaction" },
  { value: "5 ans",   label: "D'expérience" },
  { value: "CFA 2Mrd+", label: "Fonds gérés" },
]

const features = [
  {
    icon: Zap,
    title: "Dépôts instantanés",
    desc: "Mobile Money (Orange, MTN, Moov), Carte Bancaire Visa/Mastercard et USDT TRC20 acceptés.",
  },
  {
    icon: TrendingUp,
    title: "Rendements quotidiens",
    desc: "Jusqu'à 7.5% de rendement journalier avec nos plans VIP Diamond. Retraits disponibles à tout moment.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité juridique",
    desc: "Conseils d'un avocat spécialisé en finance. Vos fonds sont protégés et vos droits garantis.",
  },
  {
    icon: Globe,
    title: "100% africain",
    desc: "Conçu pour l'Afrique. Adapté aux réalités locales avec un support en français 24h/24.",
  },
]

const plans = [
  { name: "Starter",  price: "5 000",     ret: "1.5%", days: 30,  color: "#888888" },
  { name: "Bronze",   price: "25 000",    ret: "2.5%", days: 60,  color: "#cd7f32" },
  { name: "Silver",   price: "100 000",   ret: "3.5%", days: 90,  color: "#c0c0c0" },
  { name: "Gold",     price: "500 000",   ret: "5.0%", days: 120, color: "#f5c518" },
  { name: "Diamond",  price: "2 000 000", ret: "7.5%", days: 180, color: "#a8d5e2" },
]

const tickerItems = [
  "BTC $67,240", "ETH $3,580", "USDT $1.00", "BNB $605", "SOL $178",
  "XRP $0.62",   "ADA $0.47", "DOGE $0.16", "MATIC $0.90", "AVAX $38",
]

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5]">
      <Navbar />

      {/* Live ticker */}
      <div className="border-b border-[#2a2a2a] bg-[#111111] py-2.5 ticker-wrap">
        <div className="ticker-inner text-xs font-mono text-[#888888]">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-[#f5c518]">●</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated background rings */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border border-[#f5c518]/10 animate-spin-slow" />
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full border border-[#f5c518]/5 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "18s" }} />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_#f5c51818_0%,_transparent_60%)]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[radial-gradient(circle,_#f5c51808_0%,_transparent_70%)] animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 relative">
          <div className="max-w-3xl">
            <AnimatedSection direction="fade" delay={0}>
              <div className="inline-flex items-center gap-2 bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-full px-4 py-2 mb-8 animate-pulse-gold">
                <Star size={14} className="text-[#f5c518]" />
                <span className="text-[#f5c518] text-sm font-medium">
                  Plateforme N°1 de minage crypto en Afrique
                </span>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={100}>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance mb-6">
                Faites fructifier votre capital avec{" "}
                <span className="shimmer-text">Afrika Minage Crypto</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={200}>
              <p className="text-[#888888] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Investissez en crypto via Mobile Money, carte bancaire ou USDT. Profitez de
                rendements quotidiens jusqu&apos;à 7.5% avec la sécurité d&apos;un avocat
                financier à vos côtés.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center justify-center gap-2 bg-[#f5c518] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[#ffd85c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_#f5c51840] text-base"
                >
                  Commencer maintenant
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/plans"
                  className="inline-flex items-center justify-center gap-2 border border-[#2a2a2a] text-[#f5f5f5] font-medium px-8 py-4 rounded-xl hover:bg-white/5 hover:border-[#f5c518]/40 transition-all duration-300 text-base"
                >
                  Voir les plans VIP
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }, i) => (
              <AnimatedSection key={label} direction="up" delay={i * 80}>
                <div className="text-center group cursor-default">
                  <p className="text-3xl font-bold text-[#f5c518] transition-transform duration-300 group-hover:scale-110">
                    {value}
                  </p>
                  <p className="text-[#888888] text-sm mt-1">{label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimatedSection direction="up">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Pourquoi choisir Afrika Minage ?
            </h2>
            <p className="text-[#888888] text-lg max-w-2xl mx-auto">
              Une plateforme pensée pour les Africains, avec les méthodes de paiement
              locales et un accompagnement juridique de qualité.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <AnimatedSection key={title} direction="up" delay={i * 100}>
              <div className="group bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#f5c518]/40 hover:bg-[#f5c518]/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_#f5c51810] h-full">
                <div className="w-12 h-12 rounded-xl bg-[#f5c518]/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#f5c518]/20 group-hover:animate-pulse-gold">
                  <Icon size={24} className="text-[#f5c518]" />
                </div>
                <h3 className="font-semibold text-[#f5f5f5] mb-2">{title}</h3>
                <p className="text-[#888888] text-sm leading-relaxed">{desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Plans preview */}
      <section className="bg-[#111111] border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <AnimatedSection direction="up">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
                Nos Plans d&apos;Investissement VIP
              </h2>
              <p className="text-[#888888] text-lg">
                Choisissez le plan qui correspond à votre objectif financier.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plans.map(({ name, price, ret, days, color }, i) => (
              <AnimatedSection key={name} direction="up" delay={i * 80}>
                <div
                  className="group bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col items-center text-center hover:border-[#f5c518]/50 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(245,197,24,0.08)] transition-all duration-300 animate-glow-border"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-full mb-4 flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover:scale-125"
                    style={{ background: `${color}20`, color }}
                  >
                    {name[0]}
                  </div>
                  <p className="font-bold text-[#f5f5f5] mb-1">{name}</p>
                  <p
                    className="text-2xl font-bold mb-1 transition-all duration-300 group-hover:scale-110"
                    style={{ color }}
                  >
                    {ret}
                  </p>
                  <p className="text-xs text-[#888888] mb-3">par jour / {days} jours</p>
                  <p className="text-xs text-[#555555]">à partir de {price} FCFA</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection direction="up" delay={400}>
            <div className="text-center mt-10">
              <Link
                href="/plans"
                className="group inline-flex items-center gap-2 bg-[#f5c518] text-black font-semibold px-8 py-4 rounded-xl hover:bg-[#ffd85c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_#f5c51840]"
              >
                Voir tous les plans
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <AnimatedSection direction="up">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6">
            Prêt à commencer votre parcours crypto ?
          </h2>
          <p className="text-[#888888] text-lg mb-10 max-w-xl mx-auto">
            Créez votre compte en 2 minutes et effectuez votre premier dépôt via Mobile
            Money ou USDT.
          </p>
          <Link
            href="/auth/signup"
            className="group inline-flex items-center gap-2 bg-[#f5c518] text-black font-semibold px-10 py-5 rounded-xl hover:bg-[#ffd85c] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_#f5c51850] text-lg"
          >
            Ouvrir un compte gratuit
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </section>

      <Footer />
    </main>
  )
}
