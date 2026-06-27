import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MarketsClient from "@/components/MarketsClient"

export default function MarketsPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Marchés <span className="text-[#f5c518]">en temps réel</span>
          </h1>
          <p className="text-[#888888] text-lg">
            Suivez les prix des principales cryptomonnaies en direct.
          </p>
        </div>
        <MarketsClient />
      </div>
      <Footer />
    </main>
  )
}
