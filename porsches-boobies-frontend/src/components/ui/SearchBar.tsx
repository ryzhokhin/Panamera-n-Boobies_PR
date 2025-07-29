'use client'

import { useState } from 'react'
import ListingCard from '@/components/ui/ListingCard'

type Listing = {
  id: string
  title: string
  price: string
  source: string
  image: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error || 'Failed to fetch listings')
      }
      const { results } = await res.json()
      setResults(results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a product..."
          className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition text-white font-semibold"
        >
          Search
        </button>
      </form>
      {loading && <p className="text-white/70 text-sm">Loading results...</p>}
      {error && <p className="text-red-400 text-sm">Error: {error}</p>}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {results.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}
    </div>
  )
}