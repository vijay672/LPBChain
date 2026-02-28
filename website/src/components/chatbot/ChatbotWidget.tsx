'use client'

import { FormEvent, useMemo, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useTokenBalance } from '@/lib/hooks/useTokenBalance'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

const CHATBOT_API_BASE_URL =
  process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001'

export default function ChatbotWidget() {
  const { isConnected } = useAccount()
  const { balance } = useTokenBalance()
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState('')

  const tokenBalance = useMemo(() => {
    const max = BigInt(Number.MAX_SAFE_INTEGER)
    const normalized = balance > max ? max : balance
    return Number(normalized)
  }, [balance])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isSending) return

    const nextMessages = [...messages, { role: 'user', content: text } satisfies ChatMessage]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsSending(true)

    try {
      const response = await fetch(`${CHATBOT_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenBalance,
          messages: nextMessages,
        }),
      })

      const payload = (await response.json()) as { reply?: string; error?: string }
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || 'Chatbot request failed.')
      }

      setMessages((current) => [...current, { role: 'assistant', content: payload.reply as string }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach chatbot server.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-6 right-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-zinc-100">AI Chatbot</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Close chatbot"
            >
              <X size={16} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto px-4 py-3 text-sm">
            {messages.length === 0 ? (
              <p className="text-zinc-400">
                {isConnected
                  ? 'Ask a blockchain question to get a real-time AI response.'
                  : 'Connect wallet first. Token balance is required for access.'}
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === 'user'
                        ? 'ml-auto max-w-[85%] rounded-xl bg-amber-400/15 px-3 py-2 text-zinc-100'
                        : 'max-w-[85%] rounded-xl bg-zinc-900 px-3 py-2 text-zinc-200'
                    }
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}
            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="gold-button inline-flex h-9 w-9 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">Balance used for gating: {tokenBalance} token(s)</p>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="gold-button fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>
    </>
  )
}
