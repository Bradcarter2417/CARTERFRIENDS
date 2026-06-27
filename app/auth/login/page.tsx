"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      setError("Email ou mot de passe incorrect. Veuillez réessayer.")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#f5c518] flex items-center justify-center">
            <span className="text-black font-bold">A</span>
          </div>
          <span
            className="text-[#f5c518] font-bold text-xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Afrika Minage Crypto
          </span>
        </Link>

        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
          <h1
            className="text-2xl font-bold text-[#f5f5f5] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Connexion
          </h1>
          <p className="text-[#888888] text-sm mb-8">
            Accédez à votre tableau de bord d&apos;investissement.
          </p>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#888888]">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 pr-12 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#888888] transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-[#f5c518] text-black font-semibold py-3.5 rounded-xl hover:bg-[#ffd85c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-6">
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-[#f5c518] hover:underline font-medium">
              Créer un compte gratuit
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
