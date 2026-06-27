import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { ShieldCheck, Scale, Globe, ArrowRight } from "lucide-react"

const team = [
  {
    name: "Maître Kouassi A.",
    role: "Avocat financier partenaire",
    desc: "Spécialiste en droit des cryptomonnaies et réglementation financière en Afrique de l'Ouest. Plus de 12 ans d'expérience.",
    icon: Scale,
    color: "#f5c518",
  },
  {
    name: "Équipe Technique",
    role: "Ingénieurs & Mineurs",
    desc: "Experts en infrastructure de minage et sécurité blockchain. Nos fermes de minage opèrent 24h/24.",
    icon: ShieldCheck,
    color: "#10b981",
  },
  {
    name: "Support Afrique",
    role: "Conseillers locaux",
    desc: "Présents dans 12 pays africains pour vous accompagner dans votre langue et selon vos besoins locaux.",
    icon: Globe,
    color: "#a8d5e2",
  },
]

const values = [
  { title: "Transparence totale", desc: "Toutes les transactions sont enregistrées sur la blockchain et consultables. Aucune donnée cachée." },
  { title: "Sécurité juridique", desc: "Notre avocat partenaire veille au respect du cadre légal et protège vos droits d'investisseur." },
  { title: "Accessibilité africaine", desc: "Mobile Money, USDT, carte bancaire — des méthodes adaptées aux réalités africaines." },
  { title: "Support humain", desc: "Une équipe disponible 24h/24 pour répondre à vos questions en français et en langues locales." },
]

export default function AboutPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1
            className="text-4xl md:text-5xl font-bold text-balance mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            À propos d&apos;<span className="text-[#f5c518]">Afrika Minage Crypto</span>
          </h1>
          <p className="text-[#888888] text-lg leading-relaxed">
            Fondée par des Africains pour les Africains, notre plateforme a pour mission de rendre l&apos;investissement crypto accessible, sécurisé et rentable sur tout le continent africain.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#111111] border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Notre mission
              </h2>
              <p className="text-[#888888] leading-relaxed mb-4">
                Afrika Minage Crypto est née d&apos;une conviction simple : les Africains méritent d&apos;accéder aux mêmes opportunités financières que le reste du monde. Le minage de cryptomonnaies représente une source de revenus passive puissante, encore sous-exploitée sur le continent.
              </p>
              <p className="text-[#888888] leading-relaxed mb-6">
                En intégrant les modes de paiement locaux (Mobile Money, USDT) et en proposant un accompagnement juridique avec un avocat spécialisé, nous offrons une expérience d&apos;investissement sécurisée et adaptée aux réalités africaines.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-[#f5c518] text-black font-semibold px-6 py-3.5 rounded-xl hover:bg-[#ffd85c] transition-colors"
              >
                Rejoindre la plateforme
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "12 000+", label: "Investisseurs" },
                { value: "12 pays", label: "Présence africaine" },
                { value: "5 ans", label: "D'expérience" },
                { value: "CFA 2Mrd+", label: "Fonds gérés" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-5 text-center"
                >
                  <p
                    className="text-2xl font-bold text-[#f5c518] mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {value}
                  </p>
                  <p className="text-[#888888] text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Notre équipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map(({ name, role, desc, icon: Icon, color }) => (
            <div
              key={name}
              className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 text-center hover:border-[#f5c518]/30 transition-all"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: `${color}15` }}
              >
                <Icon size={28} style={{ color }} />
              </div>
              <h3
                className="font-bold text-[#f5f5f5] mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {name}
              </h3>
              <p className="text-[#f5c518] text-sm font-medium mb-4">{role}</p>
              <p className="text-[#888888] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#111111] border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            className="text-3xl font-bold mb-10 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-5"
              >
                <h3
                  className="font-bold text-[#f5c518] mb-2 text-sm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {title}
                </h3>
                <p className="text-[#888888] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
