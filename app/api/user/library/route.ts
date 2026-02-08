import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    const result = await query(
      `SELECT o.id, o.listing_id as "listingId", c.display_name as "creatorName", l.title, o.created_at as "purchasedAt"
       FROM orders o
       JOIN listings l ON o.listing_id = l.id
       JOIN creators c ON l.creator_id = c.id
       WHERE o.buyer_id = $1 AND o.status = 'completed'
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return NextResponse.json({ items: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
