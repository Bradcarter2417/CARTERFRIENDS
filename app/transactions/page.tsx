import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TransactionsClient from "@/components/TransactionsClient"

export default async function TransactionsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <main className="bg-[#0a0a0a] text-[#f5f5f5] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-[#f5f5f5] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transactions
          </h1>
          <p className="text-[#888888]">
            Déposez, retirez et consultez l&apos;historique de vos paiements réels.
          </p>
        </div>
        <TransactionsClient userId={user.id} initialTransactions={transactions ?? []} />
      </div>
      <Footer />
    </main>
  )
}
