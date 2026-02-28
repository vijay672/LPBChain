'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DUMMY_LOGIN_ID, DUMMY_LOGIN_PASSWORD, setAuthenticated } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loginId === DUMMY_LOGIN_ID && password === DUMMY_LOGIN_PASSWORD) {
      setAuthenticated(true)
      router.replace('/')
      return
    }
    setError('Invalid ID or password.')
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center">
        <section className="glass-card w-full max-w-md p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Secure Access</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gold">PLU AI Login</h1>
            <p className="mt-2 text-sm text-zinc-400">Use demo credentials to access the dashboard.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginId" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Login ID
              </label>
              <input
                id="loginId"
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
                placeholder="Enter login ID"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-gold"
                placeholder="Enter password"
              />
            </div>

            {error ? <p className="text-xs text-red-400">{error}</p> : null}

            <button type="submit" className="gold-button w-full py-3 text-sm font-bold">
              Login
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
