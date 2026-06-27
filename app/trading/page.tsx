"use client"

import { useState, useEffect, useCallback, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpDown, X, CheckCircle, Zap } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { createClient } from "@/lib/supabase/client"

const FCFA_RATE = 655.96

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  high_24h: number
  low_24h: number
  market_cap: number
  total_volume: number
}

interface Trade {
  id: string
  coin_id: string
  coin_symbol: string
  coin_name: string
  side: "buy" | "sell"
  quantity: number
  entry_price_usd: number
  close_price_usd: number | null
  amount_fcfa: number
  status: "open" | "closed" | "cancelled"
  pnl_fcfa: number | null
  leverage: number
  opened_at: string
  closed_at: string | null
}

const POPULAR = ["bitcoin","ethereum","solana","binancecoin","ripple","dogecoin","cardano","avalanche-2","chainlink","polkadot"]

function fmtPrice(p: number) {
  if (p >= 1000) return p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 1)    return p.toFixed(4)
  if (p >= 0.01) return p.toFixed(5)
  return p.toFixed(8)
}

function fmtFCFA(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function TradingContent() {
  const params = useSearchParams()
  const supabase = createClient()

  const [coinId,   setCoinId]   = useState(params.get("coin") ?? "bitcoin")
  const [coinData, setCoinData] = useState<Coin | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [user,     setUser]     = useState<{ id: string; email: string } | null>(null)
  const [trades,   setTrades]   = useState<Trade[]>([])
  const [tab,      setTab]      = useState<"open" | "history">("open")

  // Order form state
  const [side,      setSide]     = useState<"buy" | "sell">("buy")
  const [amountStr, setAmountStr] = useState("")
  const [leverage,  setLeverage] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [toast,     setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchCoin = useCallback(async (id: string) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&sparkline=false&price_change_percentage=24h`,
        { cache: "no-store" }
      )
      const [data] = await res.json()
      setCoinData(data ?? null)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchCoin(coinId)
    timer.current = setInterval(() => fetchCoin(coinId), 8_000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [coinId, fetchCoin])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email ?? "" })
    })
  }, [supabase])

  const fetchTrades = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", uid)
      .order("opened_at", { ascending: false })
    if (data) setTrades(data as Trade[])
  }, [supabase])

  useEffect(() => {
    if (user) fetchTrades(user.id)
  }, [user, fetchTrades])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const handleTrade = async () => {
    if (!user) { showToast("error", "Connectez-vous pour trader."); return }
    if (!coinData) return
    const amount = parseFloat(amountStr)
    if (!amount || amount <= 0) { showToast("error", "Montant invalide."); return }
    if (amount < 1000) { showToast("error", "Montant minimum: 1 000 FCFA."); return }

    setSubmitting(true)
    const priceUsd    = coinData.current_price
    const qty         = (amount / FCFA_RATE) / priceUsd
    const leveragedAmt = amount * leverage

    const { error } = await supabase.from("trades").insert({
      user_id:         user.id,
      coin_id:         coinData.id,
      coin_symbol:     coinData.symbol,
      coin_name:       coinData.name,
      side,
      quantity:        qty,
      entry_price_usd: priceUsd,
      amount_fcfa:     leveragedAmt,
      leverage,
      status:          "open",
    })

    if (error) {
      showToast("error", "Erreur lors de l\'ordre. Réessayez.")
    } else {
      showToast("success", `Ordre ${side === "buy" ? "achat" : "vente"} ${coinData.symbol.toUpperCase()} passé avec succès!`)
      setAmountStr("")
      fetchTrades(user.id)
    }
    setSubmitting(false)
  }

  const closeTrade = async (trade: Trade) => {
    if (!coinData || trade.coin_id !== coinData.id) {
      showToast("error", "Naviguez sur le bon actif pour clôturer ce trade.")
      return
    }
    const closePrice = coinData.current_price
    const pnlUsd = trade.side === "buy"
      ? (closePrice - trade.entry_price_usd) * trade.quantity * trade.leverage
      : (trade.entry_price_usd - closePrice) * trade.quantity * trade.leverage
    const pnlFcfa = pnlUsd * FCFA_RATE

    const { error } = await supabase.from("trades").update({
      status:          "closed",
      close_price_usd: closePrice,
      pnl_fcfa:        pnlFcfa,
      closed_at:       new Date().toISOString(),
    }).eq("id", trade.id)

    if (error) showToast("error", "Erreur lors de la clôture.")
    else {
      showToast("success", `Trade clôturé. P&L: ${pnlFcfa >= 0 ? "+" : ""}${fmtFCFA(pnlFcfa)} FCFA`)
      if (user) fetchTrades(user.id)
    }
  }

  const openTrades   = trades.filter(t => t.status === "open")
  const closedTrades = trades.filter(t => t.status !== "open")

  const totalPnl = closedTrades.reduce((acc, t) => acc + (t.pnl_fcfa ?? 0), 0)
  const unrealizedPnl = openTrades.reduce((acc, t) => {
    if (!coinData || t.coin_id !== coinData.id) return acc
    const pnlUsd = t.side === "buy"
      ? (coinData.current_price - t.entry_price_usd) * t.quantity * t.leverage
      : (t.entry_price_usd - coinData.current_price) * t.quantity * t.leverage
    return acc + pnlUsd * FCFA_RATE
  }, 0)

  const amount = parseFloat(amountStr) || 0
  const estimatedQty = coinData ? (amount / FCFA_RATE) / coinData.current_price : 0
  const totalWithLeverage = amount * leverage

  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-[slideDown_0.3s_ease-out] ${
          toast.type === "success"
            ? "bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]"
            : "bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]"
        }`}>
          <CheckCircle size={16} />
          {toast.msg}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Top bar — coin selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {POPULAR.map(id => (
            <button
              key={id}
              onClick={() => { setCoinId(id); setLoading(true) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                coinId === id
                  ? "bg-[#f5c518] text-[#0a0a0a]"
                  : "bg-[#111] border border-[#2a2a2a] text-[#888] hover:border-[#f5c518]/40 hover:text-[#f5c518]"
              }`}
            >
              {id === "bitcoin" ? "BTC" : id === "ethereum" ? "ETH" : id === "solana" ? "SOL"
                : id === "binancecoin" ? "BNB" : id === "ripple" ? "XRP" : id === "dogecoin" ? "DOGE"
                : id === "cardano" ? "ADA" : id === "avalanche-2" ? "AVAX" : id === "chainlink" ? "LINK"
                : "DOT"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Price + Stats */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Price card */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              {loading || !coinData ? (
                <div className="h-20 animate-pulse bg-[#1a1a1a] rounded-xl" />
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={coinData.image} alt={coinData.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h2 className="text-xl font-bold text-[#f5f5f5]" style={{ fontFamily: "var(--font-heading)" }}>
                        {coinData.name} <span className="text-[#555] text-sm uppercase">/ USDT</span>
                      </h2>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      <span className="text-[#555] text-xs">Live</span>
                      <RefreshCw size={11} className="text-[#555] animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <p className="text-4xl font-bold text-[#f5f5f5]" style={{ fontFamily: "var(--font-heading)" }}>
                        ${fmtPrice(coinData.current_price)}
                      </p>
                      <p className="text-[#888] text-sm mt-0.5">
                        {fmtFCFA(coinData.current_price * FCFA_RATE)} FCFA
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-lg font-semibold ${coinData.price_change_percentage_24h >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {coinData.price_change_percentage_24h >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                      {coinData.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coinData.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    {[
                      { label: "Haut 24h",   value: `$${fmtPrice(coinData.high_24h)}` },
                      { label: "Bas 24h",    value: `$${fmtPrice(coinData.low_24h)}` },
                      { label: "Cap. marché",value: coinData.market_cap >= 1e9 ? `$${(coinData.market_cap / 1e9).toFixed(2)}B` : `$${(coinData.market_cap / 1e6).toFixed(1)}M` },
                      { label: "Volume 24h", value: coinData.total_volume >= 1e9 ? `$${(coinData.total_volume / 1e9).toFixed(2)}B` : `$${(coinData.total_volume / 1e6).toFixed(1)}M` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#0a0a0a] rounded-xl p-3">
                        <p className="text-[#555] text-xs mb-1">{label}</p>
                        <p className="text-sm font-semibold text-[#f5f5f5]">{value}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* P&L summary */}
            {user && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Positions ouvertes", value: openTrades.length.toString(), color: "#f5c518" },
                  { label: "P&L non réalisé", value: `${unrealizedPnl >= 0 ? "+" : ""}${fmtFCFA(unrealizedPnl)} F`, color: unrealizedPnl >= 0 ? "#10b981" : "#ef4444" },
                  { label: "P&L total réalisé", value: `${totalPnl >= 0 ? "+" : ""}${fmtFCFA(totalPnl)} F`, color: totalPnl >= 0 ? "#10b981" : "#ef4444" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 text-center">
                    <p className="text-[#555] text-xs mb-1">{label}</p>
                    <p className="text-base font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Positions table */}
            {user && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
                <div className="flex gap-1 mb-4">
                  {(["open","history"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        tab === t ? "bg-[#f5c518] text-[#0a0a0a]" : "text-[#888] hover:text-[#f5f5f5]"
                      }`}
                    >
                      {t === "open" ? `Positions ouvertes (${openTrades.length})` : `Historique (${closedTrades.length})`}
                    </button>
                  ))}
                </div>

                {tab === "open" && (
                  <>
                    {openTrades.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Aucune position ouverte.</p>
                    ) : (
                      <div className="space-y-2">
                        {openTrades.map(t => {
                          const pnlUsd = coinData && t.coin_id === coinData.id
                            ? (t.side === "buy"
                                ? (coinData.current_price - t.entry_price_usd) * t.quantity * t.leverage
                                : (t.entry_price_usd - coinData.current_price) * t.quantity * t.leverage)
                            : null
                          const pnlF = pnlUsd != null ? pnlUsd * FCFA_RATE : null
                          return (
                            <div key={t.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center bg-[#0a0a0a] rounded-xl px-4 py-3 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                t.side === "buy" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#ef4444]/15 text-[#ef4444]"
                              }`}>{t.side}</span>
                              <div>
                                <span className="font-semibold text-[#f5f5f5]">{t.coin_symbol.toUpperCase()}</span>
                                {t.leverage > 1 && <span className="ml-1.5 text-[10px] text-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.5 rounded">x{t.leverage}</span>}
                                <p className="text-[#555] text-xs">{t.quantity.toFixed(6)} @ ${fmtPrice(t.entry_price_usd)}</p>
                              </div>
                              <div className="text-right hidden sm:block">
                                <p className="text-[#888] text-xs">Montant</p>
                                <p className="font-semibold">{fmtFCFA(t.amount_fcfa)} F</p>
                              </div>
                              <div className="text-right hidden sm:block">
                                <p className="text-[#888] text-xs">P&L</p>
                                {pnlF != null ? (
                                  <p className={`font-semibold text-sm ${pnlF >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                    {pnlF >= 0 ? "+" : ""}{fmtFCFA(pnlF)} F
                                  </p>
                                ) : (
                                  <p className="text-[#444] text-xs">—</p>
                                )}
                              </div>
                              <div className="text-right hidden md:block">
                                <p className="text-[#555] text-xs">{new Date(t.opened_at).toLocaleDateString("fr-FR")}</p>
                              </div>
                              <button
                                onClick={() => closeTrade(t)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ef4444]/10 text-[#ef4444] text-xs font-semibold hover:bg-[#ef4444]/20 transition-colors"
                              >
                                <X size={11} />
                                Clôturer
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}

                {tab === "history" && (
                  <>
                    {closedTrades.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Aucun historique.</p>
                    ) : (
                      <div className="space-y-2">
                        {closedTrades.map(t => (
                          <div key={t.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center bg-[#0a0a0a] rounded-xl px-4 py-3 text-sm">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              t.side === "buy" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-[#ef4444]/15 text-[#ef4444]"
                            }`}>{t.side}</span>
                            <div>
                              <span className="font-semibold text-[#f5f5f5]">{t.coin_symbol.toUpperCase()}</span>
                              {t.leverage > 1 && <span className="ml-1.5 text-[10px] text-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.5 rounded">x{t.leverage}</span>}
                              <p className="text-[#555] text-xs">{t.quantity.toFixed(6)} @ ${fmtPrice(t.entry_price_usd)}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                              <p className="text-[#888] text-xs">Clôture</p>
                              <p className="font-semibold">{t.close_price_usd ? `$${fmtPrice(t.close_price_usd)}` : "—"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[#888] text-xs">P&L</p>
                              <p className={`font-bold ${(t.pnl_fcfa ?? 0) >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                {(t.pnl_fcfa ?? 0) >= 0 ? "+" : ""}{fmtFCFA(t.pnl_fcfa ?? 0)} F
                              </p>
                            </div>
                            <div className="text-right hidden md:block">
                              <p className="text-[#555] text-xs">{new Date(t.opened_at).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Order form */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5 sticky top-20">
              <h3 className="text-base font-bold text-[#f5f5f5] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Passer un ordre
              </h3>

              {/* Buy / Sell toggle */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  onClick={() => setSide("buy")}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    side === "buy"
                      ? "bg-[#10b981] text-white shadow-[0_0_20px_#10b98130]"
                      : "bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20"
                  }`}
                >
                  Acheter
                </button>
                <button
                  onClick={() => setSide("sell")}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    side === "sell"
                      ? "bg-[#ef4444] text-white shadow-[0_0_20px_#ef444430]"
                      : "bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20"
                  }`}
                >
                  Vendre
                </button>
              </div>

              {/* Actif */}
              <div className="mb-4">
                <label className="text-[#888] text-xs mb-1.5 block">Actif</label>
                <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3">
                  {coinData && <img src={coinData.image} alt="" className="w-5 h-5 rounded-full" />}
                  <span className="font-semibold text-sm text-[#f5f5f5]">
                    {coinData ? `${coinData.name} (${coinData.symbol.toUpperCase()})` : "Chargement…"}
                  </span>
                  {coinData && (
                    <span className={`ml-auto text-xs font-semibold ${coinData.price_change_percentage_24h >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      ${fmtPrice(coinData.current_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="text-[#888] text-xs mb-1.5 block">Montant (FCFA)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={amountStr}
                  onChange={e => setAmountStr(e.target.value)}
                  placeholder="Ex: 50 000"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-[#f5f5f5] placeholder:text-[#444] focus:outline-none focus:border-[#f5c518]/50 transition-colors"
                />
                <div className="flex gap-2 mt-2">
                  {[5000,10000,25000,50000].map(v => (
                    <button
                      key={v}
                      onClick={() => setAmountStr(v.toString())}
                      className="flex-1 py-1.5 rounded-lg bg-[#1a1a1a] text-[#888] text-xs hover:bg-[#f5c518]/10 hover:text-[#f5c518] transition-all"
                    >
                      {v >= 1000 ? `${v/1000}K` : v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leverage */}
              <div className="mb-5">
                <label className="text-[#888] text-xs mb-1.5 flex justify-between">
                  <span>Levier</span>
                  <span className="text-[#f5c518] font-bold">x{leverage}</span>
                </label>
                <input
                  type="range" min="1" max="10" step="1"
                  value={leverage}
                  onChange={e => setLeverage(Number(e.target.value))}
                  className="w-full accent-[#f5c518]"
                />
                <div className="flex justify-between text-[#444] text-xs mt-1">
                  <span>x1</span><span>x5</span><span>x10</span>
                </div>
              </div>

              {/* Summary */}
              {amount > 0 && coinData && (
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4 mb-5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#555]">Quantité estimée</span>
                    <span className="font-mono text-[#f5f5f5]">{estimatedQty.toFixed(8)} {coinData.symbol.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">Levier appliqué</span>
                    <span className="font-semibold text-[#f5c518]">x{leverage}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#1a1a1a] pt-2 mt-2">
                    <span className="text-[#888] font-semibold">Total exposé</span>
                    <span className="font-bold text-[#f5f5f5]">{fmtFCFA(totalWithLeverage)} FCFA</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              {user ? (
                <button
                  onClick={handleTrade}
                  disabled={submitting || !coinData || !amountStr}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    side === "buy"
                      ? "bg-[#10b981] text-white hover:bg-[#059669] hover:shadow-[0_0_25px_#10b98140]"
                      : "bg-[#ef4444] text-white hover:bg-[#dc2626] hover:shadow-[0_0_25px_#ef444440]"
                  }`}
                >
                  {submitting ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Zap size={15} />
                  )}
                  {side === "buy" ? "Acheter" : "Vendre"} {coinData?.symbol.toUpperCase() ?? ""}
                </button>
              ) : (
                <a
                  href="/auth/login"
                  className="w-full block text-center py-3.5 rounded-xl bg-[#f5c518] text-[#0a0a0a] font-bold text-sm hover:bg-[#ffd85c] transition-colors"
                >
                  Se connecter pour trader
                </a>
              )}

              <p className="text-[#444] text-xs text-center mt-3 leading-relaxed">
                Le trading de cryptomonnaies comporte des risques de perte. Le levier amplifie les gains et les pertes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function TradingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><RefreshCw size={24} className="text-[#f5c518] animate-spin" /></div>}>
      <TradingContent />
    </Suspense>
  )
}
