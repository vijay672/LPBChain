import { Clock } from 'lucide-react'
import { secondsToDhms } from '@/lib/utils/timeHelpers'

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-bold tracking-tighter tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] font-bold text-zinc-600 uppercase">{label}</span>
    </div>
  )
}

export default function CountdownTimer({ seconds }: { seconds: number }) {
  const { days, hours, minutes, seconds: secs } = secondsToDhms(seconds)

  return (
    <div className="flex items-center gap-6">
      <Clock size={16} className="text-zinc-600" />
      <div className="flex items-center gap-4">
        <TimeBlock value={days} label="d" />
        <span className="text-zinc-700 font-bold">:</span>
        <TimeBlock value={hours} label="h" />
        <span className="text-zinc-700 font-bold">:</span>
        <TimeBlock value={minutes} label="m" />
        <span className="text-zinc-700 font-bold">:</span>
        <TimeBlock value={secs} label="s" />
      </div>
    </div>
  )
}
