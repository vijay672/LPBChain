'use client'

import { useAccount } from 'wagmi'
import { Copy, ExternalLink } from 'lucide-react'
import { useTokenBalance } from '@/lib/hooks/useTokenBalance'
import { formatAddress } from '@/lib/utils/formatAddress'
import { formatToken } from '@/lib/utils/formatToken'
import { TOKEN_SYMBOL } from '@/contracts/token'

export default function WalletOverviewCard() {
  const { address } = useAccount()
  const { balance } = useTokenBalance()

  const usdValue = (Number(balance) / 10 ** 18) * 0.25

  async function handleCopyAddress() {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
    } catch (error) {
      console.error('Failed to copy wallet address:', error)
    }
  }

  function handleOpenExplorer() {
    if (!address) return
    window.open(`https://testnet.bscscan.com/address/${address}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="glass-card flex h-full flex-col p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Wallet Overview</h2>
        <div className="flex items-center gap-3 text-zinc-500">
          <button
            type="button"
            onClick={handleCopyAddress}
            disabled={!address}
            className="transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Copy wallet address"
          >
            <Copy size={16} />
          </button>
          <button
            type="button"
            onClick={handleOpenExplorer}
            disabled={!address}
            className="transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Open wallet in explorer"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-1 text-sm text-zinc-500">Connected Address</p>
          <p className="font-mono text-xl text-gold">{address ? formatAddress(address) : 'Not Connected'}</p>
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-sm text-zinc-500">Token Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">{formatToken(balance)}</span>
              <span className="text-xl font-bold text-gold">{TOKEN_SYMBOL}</span>
            </div>
            <p className="text-sm text-zinc-500">
              ~ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 text-3xl font-bold text-gold">
            {TOKEN_SYMBOL.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  )
}
