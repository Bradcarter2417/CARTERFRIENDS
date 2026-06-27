"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, UserPlus, AlertCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 18) {
      setError("Vous devez avoir au moins 18 ans pour créer un compte.")
      return
    }

    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
    if (!pwRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.",
      )
      return
    }

    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, phone, age: ageNum },
      },
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    router.push("/auth/signup-success")
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
            Créer un compte
          </h1>
          <p className="text-[#888888] text-sm mb-8">
            Rejoignez des milliers d&apos;investisseurs africains.
          </p>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 00 00 00"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  required
                  min={18}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#f5f5f5] placeholder-[#555555] focus:outline-none focus:border-[#f5c518] transition-colors text-sm"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-[#888888] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
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
              <p className="text-[#555555] text-xs mt-2">
                Au moins 8 caractères avec une lettre et un chiffre.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                id="terms"
                className="mt-1 accent-[#f5c518]"
              />
              <label htmlFor="terms" className="text-[#888888] text-xs leading-relaxed">
                J&apos;ai lu et j&apos;accepte les{" "}
                <span className="text-[#f5c518]">conditions générales</span>. Je comprends
                que les investissements crypto comportent des risques et que j&apos;ai
                au moins 18 ans.
              </label>
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
                  <UserPlus size={18} />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-6">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-[#f5c518] hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
