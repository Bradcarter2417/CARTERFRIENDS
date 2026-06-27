"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  BookOpen,
  Star,
  Info,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"

const navLinks = [
  { href: "/", label: "Accueil", icon: null },
  { href: "/plans", label: "Plans VIP", icon: Star },
  { href: "/markets", label: "Marchés", icon: TrendingUp },
  { href: "/education", label: "Education", icon: BookOpen },
  { href: "/about", label: "À propos", icon: Info },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#2a2a2a] animate-[slideDown_0.4s_ease-out]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#f5c518] flex items-center justify-center">
            <span className="text-black font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>A</span>
          </div>
          <span className="text-[#f5c518] font-bold text-lg hidden sm:block" style={{ fontFamily: "var(--font-heading)" }}>
            Afrika Minage
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[#f5c518]/10 text-[#f5c518]"
                  : "text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-[#f5c518]/10 text-[#f5c518]"
                    : "text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5"
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/transactions"
                    ? "bg-[#f5c518]/10 text-[#f5c518]"
                    : "text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5"
                }`}
              >
                <ArrowLeftRight size={16} />
                Transactions
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#888888] hover:text-[#ef4444] hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5 transition-colors"
              >
                <LogIn size={16} />
                Connexion
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#f5c518] text-black hover:bg-[#ffd85c] transition-colors"
              >
                <UserPlus size={16} />
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#0a0a0a] px-4 py-4 flex flex-col gap-1 animate-[fadeIn_0.2s_ease-out]">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-[#f5c518]/10 text-[#f5c518]"
                  : "text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5"
              }`}
            >
              {Icon && <Icon size={16} />}
              {label}
            </Link>
          ))}
          <div className="border-t border-[#2a2a2a] mt-2 pt-2 flex flex-col gap-1">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link href="/transactions" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[#888888] hover:text-[#f5f5f5] hover:bg-white/5">
                  <ArrowLeftRight size={16} /> Transactions
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[#888888] hover:text-[#ef4444] hover:bg-red-500/10">
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-[#888888] hover:text-[#f5f5f5]">
                  <LogIn size={16} /> Connexion
                </Link>
                <Link href="/auth/signup" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-[#f5c518] text-black hover:bg-[#ffd85c]">
                  <UserPlus size={16} /> Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
