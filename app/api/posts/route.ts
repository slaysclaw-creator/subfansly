import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    const creator = await query(
      'SELECT id FROM creators WHERE user_id = $1',
      [userId]
    );

    if (creator.rows.length === 0) {
      return NextResponse.json({ error: 'Not a creator' }, { status: 403 });
    }

    const creatorId = creator.rows[0].id;
    const { title, content, imageUrl, isPaidOnly, priceCents } = await request.json();

    const result = await query(
      `INSERT INTO posts (creator_id, title, content, image_url, is_paid_only, price_cents, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id`,
      [creatorId, title, content, imageUrl, isPaidOnly, priceCents]
    );

    return NextResponse.json({ post: { id: result.rows[0].id } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
