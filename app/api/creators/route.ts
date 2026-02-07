import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET all creators
export async function GET(req: NextRequest) {
  try {
    const result = await query(
      `SELECT c.id, c.user_id, c.display_name, c.avatar_url, c.banner_url, c.bio, 
              c.subscription_price_monthly, c.total_subscribers, c.total_earnings, c.verification_status,
              u.username, u.avatar_url as user_avatar
       FROM creators c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.total_subscribers DESC`
    );

    return NextResponse.json({ creators: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Get creators error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new creator profile
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { displayName, bio, subscriptionPrice } = await req.json();

    if (!displayName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already has a creator profile
    const existingCreator = await query(
      'SELECT id FROM creators WHERE user_id = $1',
      [payload.userId]
    );

    if (existingCreator.rows.length > 0) {
      return NextResponse.json(
        { error: 'Creator profile already exists' },
        { status: 400 }
      );
    }

    // Create creator profile
    const result = await query(
      `INSERT INTO creators (user_id, display_name, bio, subscription_price_monthly)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, display_name, bio, subscription_price_monthly`,
      [payload.userId, displayName, bio || '', subscriptionPrice || 4.99]
    );

    // Update user's is_creator flag
    await query('UPDATE users SET is_creator = true WHERE id = $1', [payload.userId]);

    return NextResponse.json(
      { creator: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create creator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

