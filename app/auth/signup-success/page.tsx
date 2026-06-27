import Link from "next/link"
import { Mail, CheckCircle } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#10b981]/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-[#10b981]" />
        </div>
        <h1
          className="text-2xl font-bold text-[#f5f5f5] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Compte créé avec succès !
        </h1>
        <p className="text-[#888888] mb-6 leading-relaxed">
          Un e-mail de confirmation a été envoyé à votre adresse. Veuillez cliquer sur
          le lien dans l&apos;e-mail pour activer votre compte.
        </p>
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#f5c518]/10 flex items-center justify-center shrink-0">
            <Mail size={20} className="text-[#f5c518]" />
          </div>
          <p className="text-[#888888] text-sm text-left leading-relaxed">
            Vérifiez votre boîte de réception et vos spams. Le lien expire dans 24 heures.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-[#f5c518] text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-[#ffd85c] transition-colors"
        >
          Aller à la connexion
        </Link>
      </div>
    </main>
  )
}
