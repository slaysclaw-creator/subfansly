import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all posts (with pagination)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const creatorId = searchParams.get('creatorId');

    const offset = (page - 1) * limit;

    let whereClause = '';
    let params: any[] = [];

    if (creatorId) {
      whereClause = 'WHERE p.creator_id = $1';
      params = [parseInt(creatorId)];
    }

    const result = await query(
      `SELECT p.id, p.creator_id, p.content, p.image_url, p.video_url, p.is_paid_only, p.price,
              p.likes_count, p.comments_count, p.created_at,
              c.display_name, c.avatar_url, u.username
       FROM posts p
       JOIN creators c ON p.creator_id = c.id
       JOIN users u ON c.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return NextResponse.json(
      { posts: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new post
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.isCreator) {
      return NextResponse.json(
        { error: 'Only creators can post' },
        { status: 403 }
      );
    }

    const {
      content,
      imageUrl,
      videoUrl,
      isPaidOnly,
      price,
    } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Get creator ID
    const creatorResult = await query(
      'SELECT id FROM creators WHERE user_id = $1',
      [payload.userId]
    );

    if (creatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      );
    }

    const creatorId = creatorResult.rows[0].id;

    const result = await query(
      `INSERT INTO posts (creator_id, content, image_url, video_url, is_paid_only, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, creator_id, content, image_url, video_url, is_paid_only, price, created_at`,
      [creatorId, content, imageUrl || null, videoUrl || null, isPaidOnly || false, price || null]
    );

    return NextResponse.json(
      { post: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

