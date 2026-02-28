'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet } from 'lucide-react'

export default function ConnectWallet() {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, connectors, isPending } = useConnect()

  const selectedConnector = connectors.find((c) => c.id === 'injected') ?? connectors[0]

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => selectedConnector && connect({ connector: selectedConnector })}
        disabled={!selectedConnector || isPending}
        className="gold-button flex items-center gap-2 px-4 py-2 text-sm"
      >
        <Wallet size={16} />
        {isPending ? 'Connecting...' : selectedConnector ? 'Connect Wallet' : 'No Wallet Found'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => disconnect()}
      className="gold-button flex items-center gap-2 px-4 py-2 text-sm gold-glow"
    >
      <div className="w-2 h-2 rounded-full bg-black/40" />
      Connected
    </button>
  )
}
