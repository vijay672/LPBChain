'use client'

import { useClaim } from '@/lib/hooks/useClaim'
import { formatToken } from '@/lib/utils/formatToken'
import { TOKEN_SYMBOL } from '@/contracts/token'
import { Zap } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function ClaimButton({ amount }: { amount: bigint }) {
  const { isConnected } = useAccount()
  const { claim, isPending, error } = useClaim()
  const disabled = !isConnected || isPending || amount === 0n

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => claim()}
        disabled={disabled}
        className="gold-button w-full py-4 flex items-center justify-center gap-2 text-lg gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Zap size={20} className="fill-current" />
        {!isConnected ? 'Connect wallet to claim' : isPending ? 'Processing...' : `Claim ${formatToken(amount)} ${TOKEN_SYMBOL}`}
      </button>
      {error ? <p className="text-xs text-red-400">{error.message}</p> : null}
    </div>
  )
}
