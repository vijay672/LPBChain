'use client'

import ConnectWallet from '../wallet/ConnectWallet'

export default function Navbar({ onLogout }: { onLogout?: () => void }) {
  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black font-bold text-xl gold-glow">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight gold-text leading-tight">
            PLU AI Ecosystem
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
            Web3 Growth Engine
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[12px] font-medium text-zinc-300">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          BNB Testnet
        </div>
        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 transition hover:border-gold hover:text-gold"
          >
            Logout
          </button>
        ) : null}
        <ConnectWallet />
      </div>
    </nav>
  )
}
