import ActivityItem from './ActivityItem'
import { Clock, ArrowRight } from 'lucide-react'
import { TOKEN_SYMBOL } from '@/contracts/token'

const MOCK_ACTIVITIES = (symbol: string) => [
  { id: 1, type: 'Claim', hash: '0x8f7d3b...2f4a6b', time: '2 hours ago', amount: `+2,500 ${symbol}`, status: 'Success' },
  { id: 2, type: 'Claim', hash: '0x1a2b3c...0f1a2b', time: '5 hours ago', amount: `+5,000 ${symbol}`, status: 'Pending' },
  { id: 3, type: 'Claim', hash: '0x9e8d7c...0f9e8d', time: '1 day ago', amount: `+7,500 ${symbol}`, status: 'Success' },
  { id: 4, type: 'Claim', hash: '0x3c4d5e...2b3c4d', time: '2 days ago', amount: `+1,000 ${symbol}`, status: 'Failed' },
]

export default function ActivityList() {
  const activities = MOCK_ACTIVITIES(TOKEN_SYMBOL)

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-zinc-400">
          <Clock size={16} />
          <h2 className="text-xs uppercase tracking-widest font-semibold">
            Recent Activity
          </h2>
        </div>
        <button className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity">
          View All
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} {...activity} />
        ))}
      </div>
    </div>
  )
}

