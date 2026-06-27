import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#f5c518] flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="text-[#f5c518] font-bold text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                Afrika Minage Crypto
              </span>
            </div>
            <p className="text-[#888888] text-sm leading-relaxed max-w-sm">
              Plateforme africaine de minage de cryptomonnaies et d&apos;investissement. Déposez via Mobile Money, Carte Bancaire ou USDT et faites fructifier votre capital.
            </p>
            <p className="mt-4 text-xs text-[#555555]">
              Conseil juridique financier assuré par notre avocat partenaire.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#f5f5f5] font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/plans", label: "Plans VIP" },
                { href: "/markets", label: "Marchés" },
                { href: "/transactions", label: "Transactions" },
                { href: "/education", label: "Education" },
                { href: "/about", label: "À propos" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[#888888] hover:text-[#f5c518] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#f5f5f5] font-semibold text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Légal & Sécurité
            </h4>
            <ul className="space-y-2 text-sm text-[#888888]">
              <li>Investissement à risque</li>
              <li>+18 ans requis</li>
              <li>Fonds sécurisés</li>
              <li>Support 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#555555] text-xs">
            © {year} Afrika Minage Crypto. Tous droits réservés.
          </p>
          <p className="text-[#555555] text-xs">
            Les investissements en cryptomonnaies comportent des risques. Investissez prudemment.
          </p>
        </div>
      </div>
    </footer>
  )
}
