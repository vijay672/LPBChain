'use client'

import { Lock, Unlock, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useVaultData } from '@/lib/hooks/useVaultData'
import { formatToken } from '@/lib/utils/formatToken'
import { TOKEN_SYMBOL } from '@/contracts/token'
import UnlockProgress from './UnlockProgress'
import CountdownTimer from './CountdownTimer'
import ClaimButton from './ClaimButton'
import ApproveButton from './ApproveButton'

export default function VestingCard() {
  const { totalLocked, releasable, startTime, duration } = useVaultData()
  const [nowUnix, setNowUnix] = useState(() => Math.floor(Date.now() / 1000))

  useEffect(() => {
    const timer = setInterval(() => {
      setNowUnix(Math.floor(Date.now() / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const startDate = startTime > 0 ? new Date(startTime * 1000) : null
  const endDate = startTime > 0 && duration > 0 ? new Date((startTime + duration) * 1000) : null
  
  const progress = startTime > 0 && duration > 0 
    ? Math.min(100, Math.max(0, ((nowUnix - startTime) / duration) * 100))
    : 0

  const timeRemaining = endDate ? Math.max(0, Math.floor(endDate.getTime() / 1000 - nowUnix)) : 0

  return (
    <div className="glass-card p-8 flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <Lock size={16} />
          <h2 className="text-xs uppercase tracking-widest font-semibold">
            Vesting Vault
          </h2>
        </div>
        <div className="px-3 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider">
          Linear Vesting
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Lock size={12} />
            TOTAL LOCKED
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              {formatToken(totalLocked)}
            </span>
            <span className="text-zinc-500 text-xs font-bold uppercase">{TOKEN_SYMBOL}</span>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 text-xs">
            <Unlock size={12} />
            RELEASABLE
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-emerald-400">
              {formatToken(releasable)}
            </span>
            <span className="text-emerald-500/60 text-xs font-bold uppercase">{TOKEN_SYMBOL}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            Start: {startDate ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            End: {endDate ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
          </div>
        </div>

        <UnlockProgress progress={progress} />

        <div className="bg-zinc-900/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-zinc-800/30">
          <CountdownTimer seconds={timeRemaining} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ApproveButton />
          <ClaimButton amount={releasable} />
        </div>
      </div>
    </div>
  )
}
