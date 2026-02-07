import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET user's subscriptions
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const result = await query(
      `SELECT s.id, s.creator_id, s.subscription_tier, s.monthly_price, s.is_active,
              s.started_at, s.expires_at, s.renewal_at,
              c.display_name, c.avatar_url, u.username
       FROM subscriptions s
       JOIN creators c ON s.creator_id = c.id
       JOIN users u ON c.user_id = u.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json(
      { subscriptions: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST subscribe to creator
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

    const { creatorId, subscriptionTier } = await req.json();

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID is required' },
        { status: 400 }
      );
    }

    // Check if creator exists and get price
    const creatorResult = await query(
      'SELECT id, subscription_price_monthly FROM creators WHERE id = $1',
      [creatorId]
    );

    if (creatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    const creator = creatorResult.rows[0];

    // Check if subscription already exists
    const existingSubscription = await query(
      'SELECT id FROM subscriptions WHERE user_id = $1 AND creator_id = $2',
      [payload.userId, creatorId]
    );

    if (existingSubscription.rows.length > 0) {
      return NextResponse.json(
        { error: 'Already subscribed to this creator' },
        { status: 400 }
      );
    }

    // Create subscription
    const result = await query(
      `INSERT INTO subscriptions (user_id, creator_id, subscription_tier, monthly_price, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, user_id, creator_id, subscription_tier, monthly_price, is_active, started_at`,
      [payload.userId, creatorId, subscriptionTier || 'basic', creator.subscription_price_monthly]
    );

    const subscription = result.rows[0];

    // Create transaction
    const platformFee = subscription.monthly_price * 0.4;
    const creatorEarnings = subscription.monthly_price * 0.6;

    await query(
      `INSERT INTO transactions (user_id, creator_id, subscription_id, amount, transaction_type, status, platform_fee, creator_earnings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        payload.userId,
        creatorId,
        subscription.id,
        subscription.monthly_price,
        'subscription',
        'completed',
        platformFee,
        creatorEarnings,
      ]
    );

    // Update creator total_subscribers and total_earnings
    await query(
      `UPDATE creators 
       SET total_subscribers = total_subscribers + 1,
           total_earnings = total_earnings + $2
       WHERE id = $1`,
      [creatorId, creatorEarnings]
    );

    return NextResponse.json(
      { subscription },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

