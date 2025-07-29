'use client'

import SearchBar from '@/components/ui/SearchBar'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 space-y-12">
      {/* Hero Section */}
      <section>
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-transparent bg-clip-text">
          Find the Best Deals
        </h1>
        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          Compare listings from Facebook Marketplace and Amazon to uncover hidden savings.
        </p>
      </section>

      {/* Search UI */}
      <section className="w-full max-w-2xl">
        <SearchBar />
      </section>
    </div>
  )
}
