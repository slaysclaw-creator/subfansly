import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '';

// POST like a post
export async function POST(
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

    // Check if like already exists
    const likeCheck = await query(
      `SELECT id FROM post_likes 
       WHERE post_id = $1 AND user_id = $2`,
      [parseInt(resolvedParams.id), userId]
    );

    if (likeCheck.rows.length > 0) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    // Add like
    await query(
      `INSERT INTO post_likes (post_id, user_id)
       VALUES ($1, $2)`,
      [parseInt(resolvedParams.id), userId]
    );

    // Update post likes count
    const result = await query(
      `UPDATE posts 
       SET likes = likes + 1
       WHERE id = $1
       RETURNING likes`,
      [parseInt(resolvedParams.id)]
    );

    return NextResponse.json({ likes: result.rows[0].likes }, { status: 201 });
  } catch (error: any) {
    console.error('Like post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE unlike a post
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

    // Remove like
    const deleteResult = await query(
      `DELETE FROM post_likes 
       WHERE post_id = $1 AND user_id = $2`,
      [parseInt(resolvedParams.id), userId]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Update post likes count
    const result = await query(
      `UPDATE posts 
       SET likes = GREATEST(likes - 1, 0)
       WHERE id = $1
       RETURNING likes`,
      [parseInt(resolvedParams.id)]
    );

    return NextResponse.json({ likes: result.rows[0].likes });
  } catch (error: any) {
    console.error('Unlike post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
