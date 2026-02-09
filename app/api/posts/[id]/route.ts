import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '';

// GET a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;

  try {
    const result = await query(
      `SELECT p.id, p.creator_id as "creatorId", c.display_name as "creatorName", c.avatar_url as "creatorAvatar",
              p.title, p.content, p.image_url as "imageUrl", p.is_paid_only as "isPaidOnly", 
              p.price_cents as "price", p.created_at as "createdAt",
              COALESCE(p.likes, 0) as likes, COALESCE(p.comments, 0) as comments
       FROM posts p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.id = $1`,
      [parseInt(resolvedParams.id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    // Check post ownership
    const postCheck = await query(
      `SELECT p.id, p.creator_id FROM posts p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.id = $1 AND c.user_id = $2`,
      [parseInt(resolvedParams.id), userId]
    );

    if (postCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, imageUrl, isPaidOnly, priceCents } = await request.json();

    const result = await query(
      `UPDATE posts 
       SET title = $1, content = $2, image_url = $3, is_paid_only = $4, price_cents = $5
       WHERE id = $6
       RETURNING id, title, content, image_url as "imageUrl", is_paid_only as "isPaidOnly", price_cents as "price"`,
      [title, content, imageUrl, isPaidOnly, priceCents, parseInt(resolvedParams.id)]
    );

    return NextResponse.json({ post: result.rows[0] });
  } catch (error: any) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    // Check post ownership
    const postCheck = await query(
      `SELECT p.id, p.creator_id FROM posts p
       JOIN creators c ON p.creator_id = c.id
       WHERE p.id = $1 AND c.user_id = $2`,
      [parseInt(resolvedParams.id), userId]
    );

    if (postCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete comments first
    await query('DELETE FROM comments WHERE post_id = $1', [parseInt(resolvedParams.id)]);

    // Delete post
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [
      parseInt(resolvedParams.id),
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
