import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET single creator
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT c.id, c.user_id, c.display_name, c.avatar_url, c.banner_url, c.bio, 
              c.subscription_price_monthly, c.total_subscribers, c.total_earnings, c.verification_status,
              u.username, u.email
       FROM creators c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [parseInt(params.id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { creator: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get creator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update creator profile
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const creatorId = parseInt(params.id);

    // Check if user owns this creator profile
    const creatorResult = await query(
      'SELECT user_id FROM creators WHERE id = $1',
      [creatorId]
    );

    if (creatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    if (creatorResult.rows[0].user_id !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const {
      displayName,
      bio,
      avatarUrl,
      bannerUrl,
      subscriptionPrice,
    } = await req.json();

    const result = await query(
      `UPDATE creators 
       SET display_name = COALESCE($2, display_name),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url),
           banner_url = COALESCE($5, banner_url),
           subscription_price_monthly = COALESCE($6, subscription_price_monthly),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, display_name, bio, avatar_url, banner_url, subscription_price_monthly`,
      [creatorId, displayName, bio, avatarUrl, bannerUrl, subscriptionPrice]
    );

    return NextResponse.json(
      { creator: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update creator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
