"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Smartphone,
  CreditCard,
  Bitcoin,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"

interface Transaction {
  id: string
  type: string
  method: string
  amount_fcfa: number
  status: string
  reference: string | null
  notes: string | null
  created_at: string
}

interface Props {
  userId: string
  initialTransactions: Transaction[]
}

const METHODS = [
  { value: "mobile_money", label: "Mobile Money", icon: Smartphone, desc: "Orange Money, MTN MoMo, Moov Money" },
  { value: "bank_card",    label: "Carte Bancaire", icon: CreditCard, desc: "Visa, Mastercard" },
  { value: "crypto_usdt",  label: "USDT TRC20", icon: TrendingUp, desc: "Tether sur réseau TRON" },
  { value: "crypto_btc",   label: "Bitcoin", icon: Bitcoin, desc: "BTC sur réseau Bitcoin" },
]

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n)
}

function statusColor(status: string) {
  if (status === "completed") return "text-[#10b981] bg-[#10b981]/10"
  if (status === "failed" || status === "cancelled") return "text-red-400 bg-red-500/10"
  return "text-[#f5c518] bg-[#f5c518]/10"
}

function statusLabel(status: string) {
  const map: Record<string, string> = { completed: "Complété", pending: "En attente", failed: "Échoué", cancelled: "Annulé" }
  return map[status] ?? status
}

function methodLabel(m: string) {
  const map: Record<string, string> = { mobile_money: "Mobile Money", bank_card: "Carte Bancaire", crypto_usdt: "USDT", crypto_btc: "Bitcoin", internal: "Interne" }
  return map[m] ?? m
}

export default function TransactionsClient({ userId, initialTransactions }: Props) {
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [tab, setTab] = useState<"history" | "deposit" | "withdraw">("history")
  const [method, setMethod] = useState("mobile_money")
  const [amount, setAmount] = useState("")
  const [reference, setReference] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const submit = async (type: "deposit" | "withdrawal") => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      setFeedback({ type: "error", msg: "Veuillez saisir un montant valide." })
      return
    }
    if (amt < 500) {
      setFeedback({ type: "error", msg: "Le montant minimum est de 500 FCFA." })
      return
    }
    setLoading(true)
    setFeedback(null)

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        method,
        amount_fcfa: amt,
        status: "pending",
        reference: reference || null,
        notes: notes || null,
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      setFeedback({ type: "error", msg: "Erreur lors de l\'enregistrement. Veuillez réessayer." })
      return
    }

    setTransactions([data, ...transactions])
    setFeedback({
      type: "success",
      msg: `${type === "deposit" ? "Dépôt" : "Retrait"} de ${fmt(amt)} FCFA enregistré. En attente de traitement.`,
    })
    setAmount("")
    setReference("")
    setNotes("")
  }

  const filteredTx =
    tab === "history"
      ? transactions
      : transactions.filter((t) => t.type === (tab === "deposit" ? "deposit" : "withdrawal"))

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#2a2a2a]">
        {[
          { key: "history", label: "Historique" },
          { key: "deposit", label: "Nouveau dépôt" },
          { key: "withdraw", label: "Nouveau retrait" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key as typeof tab); setFeedback(null) }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === key
                ? "border-[#f5c518] text-[#f5c518]"
                : "border-transparent text-[#888888] hover:text-[#f5f5f5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-xl p-4 mb-6 ${
            feedback.type === "success"
              ? "bg-[#10b981]/10 border border-[#10b981]/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle size={18} className="text-[#10b981] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${feedback.type === "success" ? "text-[#10b981]" : "text-red-400"}`}>
            {feedback.msg}
          </p>
          <button
            onClick={() => setFeedback(null)}
            className="ml-auto text-[#555555] hover:text-[#888888]"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Deposit / Withdraw form */}
      {(tab === "deposit" || tab === "withdraw") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
            <h2
              className="font-bold text-[#f5f5f5] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {tab === "deposit" ? "Effectuer un dépôt" : "Demander un retrait"}
            </h2>

            {/* Method selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#888888] mb-3">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => setMethod(value)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                      method === value
                        ? "border-[#f5c518] bg-[#f5c518]/5"
                        : "border-[#2a2a2a] hover:border-[#f5c518]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={method === value ? "text-[#f5c518]" : "text-[#888888]"} />
                      <span className={`text-sm font-medium ${method === value ? "text-[#f5c518]" : "text-[#f5f5f5]"}`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-[#555555]">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Montant (FCFA) — Min. 500 FCFA
              </label>
              <input
                type="number"
                min={500}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 50 000"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
              />
            </div>

            {/* Reference */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Référence de paiement <span className="text-[#555555]">(optionnel)</span>
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: TXN-20250601-ABCD"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Notes <span className="text-[#555555]">(optionnel)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations complémentaires..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm resize-none"
              />
            </div>

            <button
              onClick={() => submit(tab === "deposit" ? "deposit" : "withdrawal")}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-[#f5c518] text-black font-semibold py-3.5 rounded-xl hover:bg-[#ffd85c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {tab === "deposit" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  Confirmer le {tab === "deposit" ? "dépôt" : "retrait"}
                </>
              )}
            </button>
          </div>

          {/* Info panel */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-[#f5f5f5] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Instructions
            </h3>
            <div className="flex flex-col gap-4 text-sm text-[#888888]">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f5c518] text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p>Choisissez votre méthode de paiement et saisissez le montant.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f5c518] text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p>Envoyez le paiement via la méthode choisie et notez la référence.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f5c518] text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p>Renseignez la référence de votre transaction et confirmez.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f5c518] text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                <p>Notre équipe valide votre transaction sous 15 à 60 minutes.</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[#f5c518]/5 border border-[#f5c518]/15 rounded-xl">
              <p className="text-xs text-[#888888] leading-relaxed">
                <span className="text-[#f5c518] font-semibold">Conseil juridique :</span> Toutes les transactions sont enregistrées et sécurisées. Votre avocat financier peut être contacté en cas de litige.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History table */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <p className="font-semibold text-[#f5f5f5]" style={{ fontFamily: "var(--font-heading)" }}>
            {filteredTx.length} transaction{filteredTx.length !== 1 ? "s" : ""}
          </p>
        </div>

        {filteredTx.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#555555]">Aucune transaction trouvée.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === "deposit"
                        ? "bg-[#10b981]/10"
                        : tx.type === "earning"
                        ? "bg-[#a8d5e2]/10"
                        : "bg-[#888888]/10"
                    }`}
                  >
                    {tx.type === "deposit" ? (
                      <ArrowUpRight size={18} className="text-[#10b981]" />
                    ) : tx.type === "earning" ? (
                      <TrendingUp size={18} className="text-[#a8d5e2]" />
                    ) : (
                      <ArrowDownLeft size={18} className="text-[#888888]" />
                    )}
                  </div>
                  <div>
                    <p className="text-[#f5f5f5] text-sm font-medium">
                      {methodLabel(tx.method)}
                    </p>
                    <p className="text-[#555555] text-xs">
                      {new Date(tx.created_at).toLocaleString("fr-FR")}
                      {tx.reference && ` · Réf: ${tx.reference}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      tx.type === "withdrawal" ? "text-[#888888]" : "text-[#10b981]"
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
    </div>
  )
}
