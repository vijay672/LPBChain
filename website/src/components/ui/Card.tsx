import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
}

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {children}
    </div>
  )
}

