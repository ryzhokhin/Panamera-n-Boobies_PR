'use client'

type Listing = {
  id: string
  title: string
  price: string
  source: string
  image: string
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:scale-[1.01] transition">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-left">
        <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
        <p className="text-pink-400 font-medium mt-1">{listing.price}</p>
        <p className="text-white/50 text-sm mt-1 capitalize">
          Source: {listing.source}
        </p>
      </div>
    </div>
  )
}
