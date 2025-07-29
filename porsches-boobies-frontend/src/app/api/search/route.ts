

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    console.log(`Received search query: ${query}`)

    // TODO: Trigger scraper logic or DB lookup here
    // Example response:
    const mockedResults = [
      {
        id: 'fb-1',
        title: `${query} - Facebook Deal`,
        price: '$150',
        source: 'facebook',
        image: 'https://placehold.co/300x200',
      },
      {
        id: 'amz-1',
        title: `${query} - Amazon Deal`,
        price: '$180',
        source: 'amazon',
        image: 'https://placehold.co/300x200',
      },
    ]

    return NextResponse.json({ results: mockedResults })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}