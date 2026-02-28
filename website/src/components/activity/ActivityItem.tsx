import { ExternalLink, ArrowDownLeft, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface ActivityItemProps {
  type: string
  hash: string
  time: string
  amount: string
  status: string
}

export default function ActivityItem({ type, hash, time, amount, status }: ActivityItemProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'Failed':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle2 size={12} />
      case 'Pending':
        return <Clock size={12} />
      case 'Failed':
        return <XCircle size={12} />
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400">
          <ArrowDownLeft size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{type}</span>
            <span className="text-zinc-500 text-xs font-mono">{hash}</span>
          </div>
          <span className="text-zinc-500 text-xs">{time}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm font-bold tracking-tight">{amount}</span>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
            {getStatusIcon(status)}
            {status}
          </div>
          <button className="text-zinc-600 group-hover:text-gold transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

