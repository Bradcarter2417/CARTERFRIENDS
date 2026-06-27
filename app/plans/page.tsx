import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n)
}

const planColors: Record<string, string> = {
  Starter: "#888888",
  Bronze: "#cd7f32",
  Silver: "#c0c0c0",
  Gold: "#f5c518",
  Diamond: "#a8d5e2",
}

const planPerks: Record<string, string[]> = {
  Starter: ["Rendement 1.5%/jour", "Durée 30 jours", "Dépôt min. 5 000 FCFA", "Support standard"],
  Bronze: ["Rendement 2.5%/jour", "Durée 60 jours", "Dépôt min. 25 000 FCFA", "Support prioritaire"],
  Silver: ["Rendement 3.5%/jour", "Durée 90 jours", "Dépôt min. 100 000 FCFA", "Support VIP", "Accès conseil juridique"],
  Gold: ["Rendement 5.0%/jour", "Durée 120 jours", "Dépôt min. 500 000 FCFA", "Support VIP 24/7", "Conseil juridique dédié"],
  Diamond: ["Rendement 7.5%/jour", "Durée 180 jours", "Dépôt min. 2 000 000 FCFA", "Support Elite", "Avocat financier dédié", "Retrait instantané"],
}

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: plans } = await supabase
    .from("plans_vip")
    .select("*")
    .order("price_fcfa", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection direction="up">
          <div className="text-center mb-16">
            <h1
              className="text-4xl md:text-5xl font-bold text-balance mb-5"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Plans d&apos;investissement <span className="shimmer-text">VIP</span>
            </h1>
            <p className="text-[#888888] text-lg max-w-2xl mx-auto">
              Choisissez votre niveau d&apos;investissement et commencez à générer des revenus
              passifs dès aujourd&apos;hui grâce au minage crypto.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {(plans ?? []).map((plan, i) => {
            const color = planColors[plan.name] ?? "#f5c518"
            const perks = planPerks[plan.name] ?? []
            const isGold = plan.name === "Gold"
            return (
              <AnimatedSection key={plan.id} direction="up" delay={i * 90}>
              <div
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 h-full ${
                  isGold
                    ? "border-[#f5c518] bg-[#f5c518]/5 scale-105 shadow-[0_0_30px_#f5c51820] hover:shadow-[0_0_50px_#f5c51830]"
                    : "border-[#2a2a2a] bg-[#111111] hover:border-[#f5c518]/30 hover:shadow-[0_8px_30px_rgba(245,197,24,0.06)]"
                }`}
              >
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f5c518] text-black text-xs font-bold px-3 py-1 rounded-full">
                    Populaire
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-5"
                  style={{ background: `${color}20`, color }}
                >
                  {plan.name[0]}
                </div>

                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color, fontFamily: "var(--font-heading)" }}
                >
                  {plan.name}
                </h2>
                <p className="text-[#888888] text-xs mb-5 leading-relaxed">{plan.description}</p>

                <div className="mb-5">
                  <span
                    className="text-4xl font-bold"
                    style={{ color, fontFamily: "var(--font-heading)" }}
                  >
                    {plan.daily_return_pct}%
                  </span>
                  <span className="text-[#888888] text-sm ml-1">/ jour</span>
                  <p className="text-[#555555] text-xs mt-1">{plan.duration_days} jours</p>
                </div>

                <p className="text-[#f5f5f5] font-semibold text-sm mb-1">
                  à partir de {fmt(plan.price_fcfa)} FCFA
                </p>
                <p className="text-[#888888] text-xs mb-6">
                  Gain total estimé :{" "}
                  <span className="text-[#10b981]">
                    {fmt(Math.round(plan.price_fcfa * (plan.daily_return_pct / 100) * plan.duration_days))} FCFA
                  </span>
                </p>

                <ul className="flex flex-col gap-2 mb-8 flex-1">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-xs text-[#888888]">
                      <Check size={14} className="text-[#10b981] shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  href={user ? "/transactions" : "/auth/signup"}
                  className="group flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={
                    isGold
                      ? { background: "#f5c518", color: "#0a0a0a" }
                      : { background: `${color}15`, color }
                  }
                >
                  Souscrire
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              </AnimatedSection>
            )
          })}
        </div>

        {/* Legal note */}
        <AnimatedSection direction="up" delay={200}>
        <div className="mt-14 bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-center">
          <p className="text-[#888888] text-sm leading-relaxed max-w-3xl mx-auto">
            <span className="text-[#f5c518] font-semibold">Avertissement juridique :</span>{" "}
            Les rendements affichés sont des estimations basées sur les performances passées du minage. Tout investissement en cryptomonnaie comporte des risques de perte en capital. Notre avocat financier partenaire est disponible pour vous conseiller avant tout investissement important.
          </p>
        </div>
        </AnimatedSection>
      </div>

      <Footer />
    </main>
  )
}
