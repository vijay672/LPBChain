'use client'

import { useApprove } from '@/lib/hooks/useApprove'
import { TOKEN_SYMBOL } from '@/contracts/token'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function ApproveButton() {
  const { isConnected } = useAccount()
  const { approve, isPending, isSuccess, error } = useApprove()

  const disabled = !isConnected || isPending || isSuccess

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => approve("500")}
        disabled={disabled}
        className={`w-full py-4 flex items-center justify-center gap-2 text-lg rounded-xl transition-all duration-300 font-bold ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
            : 'gold-button gold-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
        }`}
      >
        {!isConnected ? (
          'Connect wallet to approve'
        ) : isPending ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Approving 500 {TOKEN_SYMBOL}...
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle2 size={20} />
            500 {TOKEN_SYMBOL} Approved
          </>
        ) : (
          <>
            <ShieldCheck size={20} />
            Approve 500 {TOKEN_SYMBOL} to Vault
          </>
        )}
      </button>
      {error ? <p className="text-xs text-red-400">{error.message}</p> : null}
    </div>
  )
}
