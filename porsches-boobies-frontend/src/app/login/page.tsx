'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black px-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-white">
          Welcome to <span className="text-pink-500">Porsches&Boobies</span>
        </h1>
        <p className="text-white/70 text-sm">
          Sign in to continue comparing the hottest deals.
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}