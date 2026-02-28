export default function UnlockProgress({ progress }: { progress: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-xs font-medium">Unlock Progress</span>
        <span className="text-white text-xs font-bold">{progress.toFixed(1)}%</span>
      </div>
      <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
        <div 
          className="h-full bg-gold rounded-full transition-all duration-500 ease-out gold-glow"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

