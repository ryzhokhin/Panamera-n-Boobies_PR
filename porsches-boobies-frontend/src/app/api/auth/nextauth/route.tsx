'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Welcome to <span className="text-pink-500">Porsches&amp;Boobies</span>
        </h1>
        <p className="text-gray-400">Log in to start finding the best deals.</p>
        <a
          href="/api/auth/signin"
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-pink-600 rounded hover:bg-pink-500 transition"
        >
          Login with Google
        </a>
      </div>
    </main>
  )
}
