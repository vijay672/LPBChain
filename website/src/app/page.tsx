'use client'

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WalletOverviewCard from "@/components/wallet/WalletOverviewCard";
import VestingCard from "@/components/vault/VestingCard";
import ActivityList from "@/components/activity/ActivityList";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { isAuthenticated, setAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter()
  const authenticated = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('storage', onStoreChange)
      return () => window.removeEventListener('storage', onStoreChange)
    },
    () => isAuthenticated(),
    () => null
  )

  useEffect(() => {
    if (authenticated === false) {
      router.replace('/login')
    }
  }, [authenticated, router])

  function handleLogout() {
    setAuthenticated(false)
    router.replace('/login')
  }

  if (authenticated !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLogout={handleLogout} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <WalletOverviewCard />
          <VestingCard />
        </div>

        <ActivityList />
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
