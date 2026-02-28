import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
      {children}
    </span>
  )
}

