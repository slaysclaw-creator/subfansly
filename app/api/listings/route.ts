import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with database calls
const mockListings = [
  {
    id: '1',
    title: 'Premium Content Pack',
    description: '100+ exclusive photos and videos',
    priceCents: 2999,
    creatorId: '1',
  },
  {
    id: '2',
    title: 'VIP Access',
    description: 'Monthly exclusive content drops',
    priceCents: 1999,
    creatorId: '1',
  },
];

export async function GET(request: NextRequest) {
  const creatorId = request.nextUrl.searchParams.get('creatorId');

  if (creatorId) {
    const listings = mockListings.filter(l => l.creatorId === creatorId);
    return NextResponse.json({ listings });
  }

  return NextResponse.json({ listings: mockListings });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // TODO: Save to database
  const newListing = {
    id: Math.random().toString(),
    ...body,
  };

  return NextResponse.json({ listing: newListing }, { status: 201 });
}
