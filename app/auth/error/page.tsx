import Link from "next/link"
import { XCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-red-400" />
        </div>
        <h1
          className="text-2xl font-bold text-[#f5f5f5] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Erreur d&apos;authentification
        </h1>
        <p className="text-[#888888] mb-8 leading-relaxed">
          Une erreur s&apos;est produite lors de la vérification de votre compte. Le lien
          a peut-être expiré. Veuillez réessayer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center bg-[#f5c518] text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-[#ffd85c] transition-colors"
          >
            Retour à la connexion
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center border border-[#2a2a2a] text-[#f5f5f5] font-medium px-8 py-3.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  )
}
