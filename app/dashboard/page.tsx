import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AnimatedSection from "@/components/AnimatedSection"
import Link from "next/link"
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react"

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n)
}

function statusColor(status: string) {
  if (status === "completed") return "text-[#10b981] bg-[#10b981]/10"
  if (status === "failed" || status === "cancelled") return "text-red-400 bg-red-500/10"
  return "text-[#f5c518] bg-[#f5c518]/10"
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    completed: "Complété",
    pending: "En attente",
    failed: "Échoué",
    cancelled: "Annulé",
  }
  return map[status] ?? status
}

function methodLabel(method: string) {
  const map: Record<string, string> = {
    mobile_money: "Mobile Money",
    bank_card: "Carte Bancaire",
    crypto_usdt: "USDT",
    crypto_btc: "Bitcoin",
    internal: "Interne",
  }
  return map[method] ?? method
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch last 5 transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Compute totals
  const allTx = transactions ?? []
  const totalDeposited = allTx
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount_fcfa), 0)
  const totalEarnings = allTx
    .filter((t) => t.type === "earning" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount_fcfa), 0)
  const totalWithdrawn = allTx
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((s, t) => s + Number(t.amount_fcfa), 0)
  const balance = totalDeposited + totalEarnings - totalWithdrawn

  // Fetch active plan
  const { data: activePlan } = await supabase
    .from("user_plans")
    .select("*, plans_vip(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(1)
    .single()

  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email

  const stats = [
    {
      label: "Solde total",
      value: `${fmt(balance)} FCFA`,
      icon: Wallet,
      color: "#f5c518",
    },
    {
      label: "Total déposé",
      value: `${fmt(totalDeposited)} FCFA`,
      icon: ArrowUpRight,
      color: "#10b981",
    },
    {
      label: "Gains reçus",
      value: `${fmt(totalEarnings)} FCFA`,
      icon: TrendingUp,
      color: "#a8d5e2",
    },
    {
      label: "Retraits effectués",
      value: `${fmt(totalWithdrawn)} FCFA`,
      icon: ArrowDownLeft,
      color: "#888888",
    },
  ]

  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <AnimatedSection direction="left" delay={0}>
          <div className="mb-10">
            <p className="text-[#888888] text-sm mb-1">Bienvenue,</p>
            <h1
              className="text-3xl font-bold text-[#f5f5f5]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {displayName}
            </h1>
          </div>
        </AnimatedSection>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <AnimatedSection key={label} direction="up" delay={i * 80}>
              <div
                className="group bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 hover:border-[#f5c518]/30 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,197,24,0.06)] transition-all duration-300 h-full"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="text-[#888888] text-xs mb-1">{label}</p>
                <p
                  className="text-lg font-bold text-[#f5f5f5]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {value}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent transactions */}
          <AnimatedSection direction="left" delay={100} className="lg:col-span-2">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-bold text-[#f5f5f5]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Dernières transactions
              </h2>
              <Link
                href="/transactions"
                className="flex items-center gap-1 text-[#f5c518] text-sm hover:underline"
              >
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>

            {allTx.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={32} className="text-[#555555] mx-auto mb-3" />
                <p className="text-[#555555] text-sm">Aucune transaction pour le moment.</p>
                <Link
                  href="/transactions"
                  className="mt-4 inline-flex items-center gap-2 bg-[#f5c518] text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#ffd85c] transition-colors"
                >
                  Faire un dépôt
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {allTx.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          tx.type === "deposit"
                            ? "bg-[#10b981]/10"
                            : tx.type === "earning"
                            ? "bg-[#a8d5e2]/10"
                            : "bg-[#888888]/10"
                        }`}
                      >
                        {tx.type === "deposit" ? (
                          <ArrowUpRight size={16} className="text-[#10b981]" />
                        ) : tx.type === "earning" ? (
                          <TrendingUp size={16} className="text-[#a8d5e2]" />
                        ) : (
                          <ArrowDownLeft size={16} className="text-[#888888]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#f5f5f5] text-sm font-medium">
                          {methodLabel(tx.method)}
                        </p>
                        <p className="text-[#555555] text-xs">
                          {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.type === "withdrawal"
                            ? "text-[#888888]"
                            : "text-[#10b981]"
                        }`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}
                        {fmt(Number(tx.amount_fcfa))} FCFA
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(tx.status)}`}
                      >
                        {statusLabel(tx.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </AnimatedSection>

          {/* Active plan + quick actions */}
          <AnimatedSection direction="right" delay={150} className="flex flex-col gap-4">
            {/* Active plan */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <h2
                className="font-bold text-[#f5f5f5] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Plan actif
              </h2>
              {activePlan ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f5c518]/10 flex items-center justify-center">
                      <Star size={20} className="text-[#f5c518]" />
                    </div>
                    <div>
                      <p
                        className="font-bold text-[#f5c518]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {activePlan.plans_vip?.name}
                      </p>
                      <p className="text-[#888888] text-xs">
                        {activePlan.plans_vip?.daily_return_pct}% / jour
                      </p>
                    </div>
                  </div>
                  <p className="text-[#555555] text-xs">
                    Démarré le{" "}
                    {new Date(activePlan.started_at).toLocaleDateString("fr-FR")}
                  </p>
                  {activePlan.ends_at && (
                    <p className="text-[#555555] text-xs mt-1">
                      Expire le{" "}
                      {new Date(activePlan.ends_at).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#555555] text-sm mb-4">
                    Aucun plan actif. Souscrivez à un plan VIP.
                  </p>
                  <Link
                    href="/plans"
                    className="inline-flex items-center gap-2 bg-[#f5c518] text-black text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#ffd85c] transition-colors"
                  >
                    Voir les plans
                  </Link>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <h2
                className="font-bold text-[#f5f5f5] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Actions rapides
              </h2>
              <div className="flex flex-col gap-3">
                <Link
                  href="/transactions"
                  className="flex items-center justify-between bg-[#1a1a1a] hover:bg-[#f5c518]/10 border border-[#2a2a2a] hover:border-[#f5c518]/30 rounded-xl px-4 py-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpRight size={18} className="text-[#10b981]" />
                    <span className="text-sm text-[#f5f5f5]">Faire un dépôt</span>
                  </div>
                  <ArrowRight size={14} className="text-[#555555]" />
                </Link>
                <Link
                  href="/transactions"
                  className="flex items-center justify-between bg-[#1a1a1a] hover:bg-[#f5c518]/10 border border-[#2a2a2a] hover:border-[#f5c518]/30 rounded-xl px-4 py-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ArrowDownLeft size={18} className="text-[#888888]" />
                    <span className="text-sm text-[#f5f5f5]">Retrait</span>
                  </div>
                  <ArrowRight size={14} className="text-[#555555]" />
                </Link>
                <Link
                  href="/plans"
                  className="flex items-center justify-between bg-[#1a1a1a] hover:bg-[#f5c518]/10 border border-[#2a2a2a] hover:border-[#f5c518]/30 rounded-xl px-4 py-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Star size={18} className="text-[#f5c518]" />
                    <span className="text-sm text-[#f5f5f5]">Plans VIP</span>
                  </div>
                  <ArrowRight size={14} className="text-[#555555]" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </main>
  )
}
