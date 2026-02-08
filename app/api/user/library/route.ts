import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);

  // TODO: Verify JWT token and get user ID
  // TODO: Query database for user's purchased items

  const mockItems = [
    {
      id: '1',
      listingId: '1',
      creatorName: 'Example Creator',
      title: 'Premium Content Pack',
      purchasedAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json({ items: mockItems });
}
