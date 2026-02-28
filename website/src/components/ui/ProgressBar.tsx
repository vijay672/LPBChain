type ProgressBarProps = {
  value: number
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div
        className="h-full rounded-full bg-zinc-900 transition-[width] dark:bg-zinc-50"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

