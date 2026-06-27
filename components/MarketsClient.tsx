"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TrendingUp, TrendingDown, Search, RefreshCw, Star, ArrowUpDown, ExternalLink, Zap } from "lucide-react"
import Link from "next/link"

const COIN_IDS = [
  "bitcoin","ethereum","tether","binancecoin","solana","ripple","usd-coin","staked-ether",
  "dogecoin","cardano","avalanche-2","shiba-inu","tron","chainlink","polkadot","matic-network",
  "bitcoin-cash","uniswap","litecoin","near","internet-computer","dai","aptos","stellar",
  "hedera-hashgraph","monero","ethereum-classic","okb","crypto-com-chain","vechain",
  "algorand","cosmos","filecoin","arbitrum","optimism","aave","eos","theta-token",
  "fantom","axie-infinity","decentraland","the-sandbox","maker","curve-dao-token",
  "pancakeswap-token","basic-attention-token","gala","flow","kava","iota","neo",
  "zcash","dash","qtum","ravencoin","nano","digibyte","bitcoin-sv","storj","siacoin",
  "loopring","lisk","wax","terra-luna-2","injective-protocol","sei-network","sui",
  "pepe","floki","baby-doge-coin","safemoon","bonk","dogwifcoin","book-of-meme",
  "render-token","fetch-ai","singularitynet","ocean-protocol","worldcoin",
  "blur","apecoin","rocket-pool","lido-dao","frax","frax-share","gmx",
  "synthetix-network-token","uma","band-protocol","api3","nucypher","keep-network",
  "mask-network","radicle","badger-dao","harvest-finance","pickle-finance"
].join(",")

const FCFA_RATE = 655.96

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  market_cap: number
  total_volume: number
  high_24h: number
  low_24h: number
  circulating_supply: number
  sparkline_in_7d?: { price: number[] }
  market_cap_rank: number
  ath: number
  ath_change_percentage: number
}

type SortKey = "rank" | "price" | "change24h" | "volume" | "marketcap"
type SortDir = "asc" | "desc"
type Filter  = "all" | "gainers" | "losers" | "favorites"

function Sparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  if (!prices || prices.length < 2) return <div className="w-20 h-8" />
  const sampled = prices.filter((_, i) => i % Math.ceil(prices.length / 20) === 0).slice(-20)
  const min = Math.min(...sampled)
  const max = Math.max(...sampled)
  const range = max - min || 1
  const W = 80, H = 32
  const pts = sampled.map((p, i) => `${(i / (sampled.length - 1)) * W},${H - ((p - min) / range) * (H - 4) - 2}`)
  const color = positive ? "#10b981" : "#ef4444"
  return (
    <svg width={W} height={H}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts.join(" ")} />
    </svg>
  )
}

function fmtBig(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

function fmtPrice(p: number) {
  if (p >= 1000) return p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 1)    return p.toFixed(4)
  if (p >= 0.01) return p.toFixed(5)
  return p.toFixed(8)
}

function PctBadge({ v }: { v: number }) {
  const pos = v >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${pos ? "text-[#10b981]" : "text-[#ef4444]"}`}>
      {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {Math.abs(v).toFixed(2)}%
    </span>
  )
}

const PER_PAGE = 25

export default function MarketsClient() {
  const [coins, setCoins]         = useState<Coin[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [search, setSearch]       = useState("")
  const [sortKey, setSortKey]     = useState<SortKey>("rank")
  const [sortDir, setSortDir]     = useState<SortDir>("asc")
  const [filter, setFilter]       = useState<Filter>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [updated, setUpdated]     = useState<Date | null>(null)
  const [selected, setSelected]   = useState<Coin | null>(null)
  const [page, setPage]           = useState(1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchCoins = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h,7d`,
        { cache: "no-store" }
      )
      if (!res.ok) throw new Error()
      const data: Coin[] = await res.json()
      setCoins(data)
      setUpdated(new Date())
      setError(null)
    } catch {
      setError("Impossible de charger les marchés. Les données seront actualisées bientôt.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoins()
    timer.current = setInterval(fetchCoins, 15_000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [fetchCoins])

  useEffect(() => {
    const s = localStorage.getItem("amk_fav")
    if (s) setFavorites(JSON.parse(s))
  }, [])

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem("amk_fav", JSON.stringify(next))
      return next
    })
  }

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(k); setSortDir("asc") }
    setPage(1)
  }

  const filtered = coins
    .filter(c => {
      if (filter === "gainers")   return c.price_change_percentage_24h > 0
      if (filter === "losers")    return c.price_change_percentage_24h < 0
      if (filter === "favorites") return favorites.includes(c.id)
      return true
    })
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const m = sortDir === "asc" ? 1 : -1
      switch (sortKey) {
        case "rank":      return (a.market_cap_rank - b.market_cap_rank) * m
        case "price":     return (a.current_price - b.current_price) * m
        case "change24h": return (a.price_change_percentage_24h - b.price_change_percentage_24h) * m
        case "volume":    return (a.total_volume - b.total_volume) * m
        case "marketcap": return (a.market_cap - b.market_cap) * m
        default: return 0
      }
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => handleSort(k)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors hover:text-[#f5c518] ${sortKey === k ? "text-[#f5c518]" : "text-[#555]"}`}
    >
      {label}
      <ArrowUpDown size={10} className="opacity-60" />
    </button>
  )

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#f5f5f5]" style={{ fontFamily: "var(--font-heading)" }}>
            Marchés <span className="shimmer-text">Crypto</span>
          </h1>
          <p className="text-[#888] text-sm mt-1">
            {coins.length} actifs en temps réel — actualisation toutes les 15 s
          </p>
        </div>
        <div className="flex items-center gap-3">
          {updated && (
            <span className="hidden sm:block text-[#444] text-xs">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] mr-1.5 animate-pulse" />
              {updated.toLocaleTimeString("fr-FR")}
            </span>
          )}
          <button
            onClick={() => { setLoading(true); fetchCoins() }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111] border border-[#2a2a2a] text-[#888] text-xs hover:border-[#f5c518]/40 hover:text-[#f5c518] transition-all"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
          <Link
            href="/trading"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f5c518] text-[#0a0a0a] text-xs font-bold hover:bg-[#ffd85c] transition-colors"
          >
            <Zap size={13} />
            Terminal Trading
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="BTC, Ethereum, Solana…"
            className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#f5f5f5] placeholder:text-[#444] focus:outline-none focus:border-[#f5c518]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all","gainers","losers","favorites"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? "bg-[#f5c518] text-[#0a0a0a]"
                  : "bg-[#111] border border-[#2a2a2a] text-[#888] hover:border-[#f5c518]/30"
              }`}
            >
              {f === "all" ? "Tous" : f === "gainers" ? "Hausse" : f === "losers" ? "Baisse" : `Favoris (${favorites.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-3 mb-5 text-[#ef4444] text-sm">
          {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && coins.length === 0 && (
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#111] border border-[#2a2a2a] rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.06 }} />
          ))}
        </div>
      )}

      {/* Table */}
      {coins.length > 0 && (
        <>
          {/* Header row */}
          <div className="hidden lg:grid gap-3 px-4 py-2 mb-1 border-b border-[#1a1a1a]"
            style={{ gridTemplateColumns: "28px 1.8fr 1fr 1fr 1fr 1fr 80px 90px 96px" }}>
            <span className="text-[#444] text-xs">#</span>
            <Th k="rank"      label="Actif" />
            <Th k="price"     label="Prix USD" />
            <span className="text-[#444] text-xs">FCFA</span>
            <Th k="change24h" label="24h" />
            <Th k="volume"    label="Volume 24h" />
            <Th k="marketcap" label="Cap." />
            <span className="text-[#444] text-xs">7 jours</span>
            <span />
          </div>

          <div className="space-y-0.5">
            {paginated.map((coin) => {
              const pos = coin.price_change_percentage_24h >= 0
              const isFav = favorites.includes(coin.id)
              const isSelected = selected?.id === coin.id
              return (
                <div key={coin.id}>
                  <div
                    onClick={() => setSelected(isSelected ? null : coin)}
                    className={`group hidden lg:grid gap-3 items-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-[#111] border-[#f5c518]/30"
                        : "border-transparent hover:bg-[#0f0f0f] hover:border-[#2a2a2a]"
                    }`}
                    style={{ gridTemplateColumns: "28px 1.8fr 1fr 1fr 1fr 1fr 80px 90px 96px" }}
                  >
                    <span className="text-[#444] text-xs">{coin.market_cap_rank}</span>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={e => { e.stopPropagation(); toggleFav(coin.id) }}
                        className={`shrink-0 transition-colors ${isFav ? "text-[#f5c518]" : "text-[#2a2a2a] group-hover:text-[#444]"}`}
                      >
                        <Star size={11} fill={isFav ? "#f5c518" : "none"} />
                      </button>
                      <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#f5f5f5] truncate leading-tight">{coin.name}</p>
                        <p className="text-[10px] text-[#555] uppercase leading-tight">{coin.symbol}</p>
                      </div>
                    </div>

                    <span className="text-sm font-mono text-[#f5f5f5]">${fmtPrice(coin.current_price)}</span>

                    <span className="text-xs font-mono text-[#666]">
                      {(coin.current_price * FCFA_RATE).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} F
                    </span>

                    <PctBadge v={coin.price_change_percentage_24h} />

                    <span className="text-xs text-[#777]">{fmtBig(coin.total_volume)}</span>
                    <span className="text-xs text-[#777]">{fmtBig(coin.market_cap)}</span>

                    <Sparkline prices={coin.sparkline_in_7d?.price ?? []} positive={pos} />

                    <Link
                      href={`/trading?coin=${coin.id}&symbol=${coin.symbol.toUpperCase()}`}
                      onClick={e => e.stopPropagation()}
                      className="justify-self-end px-3 py-1.5 rounded-lg bg-[#f5c518]/10 text-[#f5c518] text-xs font-semibold hover:bg-[#f5c518] hover:text-[#0a0a0a] transition-all"
                    >
                      Trader
                    </Link>
                  </div>

                  {/* Mobile card */}
                  <div
                    onClick={() => setSelected(isSelected ? null : coin)}
                    className={`lg:hidden flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected ? "bg-[#111] border-[#f5c518]/30" : "border-transparent hover:bg-[#0f0f0f] hover:border-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#444] text-xs w-5">{coin.market_cap_rank}</span>
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-[#f5f5f5]">{coin.name}</p>
                        <p className="text-xs text-[#555] uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-[#f5f5f5]">${fmtPrice(coin.current_price)}</p>
                      <PctBadge v={coin.price_change_percentage_24h} />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div className="bg-[#0d0d0d] border border-[#2a2a2a] border-t-0 rounded-b-xl px-4 pb-4 pt-3 animate-[fadeIn_0.15s_ease-out]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                        {[
                          { label: "Plus haut 24h",  value: `$${fmtPrice(coin.high_24h)}` },
                          { label: "Plus bas 24h",   value: `$${fmtPrice(coin.low_24h)}` },
                          { label: "ATH",            value: `$${fmtPrice(coin.ath)}` },
                          { label: "Depuis ATH",     value: `${coin.ath_change_percentage.toFixed(1)}%` },
                          { label: "Cap. marché",    value: fmtBig(coin.market_cap) },
                          { label: "Volume 24h",     value: fmtBig(coin.total_volume) },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-[#111] rounded-xl p-3">
                            <p className="text-[#555] text-xs mb-1">{label}</p>
                            <p className="text-sm font-semibold text-[#f5f5f5]">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/trading?coin=${coin.id}&symbol=${coin.symbol.toUpperCase()}`}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5c518] text-[#0a0a0a] text-sm font-bold hover:bg-[#ffd85c] transition-colors"
                        >
                          <Zap size={14} />
                          Trader {coin.symbol.toUpperCase()}
                        </Link>
                        <a
                          href={`https://www.coingecko.com/en/coins/${coin.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-xs hover:border-[#f5c518]/40 transition-all"
                        >
                          <ExternalLink size={12} />
                          CoinGecko
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-[#111] border border-[#2a2a2a] text-[#888] text-sm disabled:opacity-30 hover:border-[#f5c518]/40 transition-all"
              >
                Précédent
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const n = page <= 4 ? i + 1 : page - 3 + i
                if (n < 1 || n > totalPages) return null
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-xl text-sm transition-all ${
                      n === page
                        ? "bg-[#f5c518] text-[#0a0a0a] font-bold"
                        : "bg-[#111] border border-[#2a2a2a] text-[#888] hover:border-[#f5c518]/40"
                    }`}
                  >
                    {n}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-[#111] border border-[#2a2a2a] text-[#888] text-sm disabled:opacity-30 hover:border-[#f5c518]/40 transition-all"
              >
                Suivant
              </button>
            </div>
          )}

          <p className="text-[#444] text-xs text-center mt-5">
            Données CoinGecko. Cours en USD. Taux de conversion: 1 USD = {FCFA_RATE} FCFA.
          </p>
        </>
      )}
    </div>
  )
}
