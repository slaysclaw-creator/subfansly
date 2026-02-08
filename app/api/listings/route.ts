import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const creatorId = request.nextUrl.searchParams.get('creatorId');

  try {
    if (creatorId) {
      const result = await query(
        `SELECT id, title, description, price_cents as "priceCents", creator_id as "creatorId"
         FROM listings
         WHERE creator_id = $1
         ORDER BY created_at DESC`,
        [parseInt(creatorId)]
      );
      return NextResponse.json({ listings: result.rows });
    }

    const result = await query(
      `SELECT id, title, description, price_cents as "priceCents", creator_id as "creatorId"
       FROM listings
       ORDER BY created_at DESC
       LIMIT 50`
    );
    return NextResponse.json({ listings: result.rows });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
