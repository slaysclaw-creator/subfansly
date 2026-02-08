import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT s.id, s.creator_id as "creatorId", c.display_name as "creatorName", s.image_url as "imageUrl", 
              s.expires_at as "expiresAt", s.price_cents as "price"
       FROM stories s
       JOIN creators c ON s.creator_id = c.id
       WHERE s.expires_at > NOW()
       ORDER BY s.created_at DESC
       LIMIT 50`
    );

    return NextResponse.json({ stories: result.rows });
  } catch (error) {
    console.error('Get stories error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { imageUrl, priceCents } = await request.json();
    const creatorId = request.headers.get('x-creator-id');

    const result = await query(
      `INSERT INTO stories (creator_id, image_url, price_cents, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '24 hours')
       RETURNING id`,
      [creatorId, imageUrl, priceCents]
    );

    return NextResponse.json({ story: { id: result.rows[0].id } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
