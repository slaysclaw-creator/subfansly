import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query(
      `SELECT p.id, p.creator_id as "creatorId", c.display_name as "creatorName", c.avatar_url as "creatorAvatar",
              p.title, p.content, p.image_url as "imageUrl", p.is_paid_only as "isPaidOnly", 
              p.price_cents as "price", p.created_at as "createdAt",
              COALESCE(p.likes, 0) as likes, COALESCE(p.comments, 0) as comments
       FROM posts p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.is_published = true
       ORDER BY p.created_at DESC
       LIMIT 50`
    );

    return NextResponse.json({ posts: result.rows });
  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
