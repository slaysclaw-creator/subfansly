import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    // Get creator profile
    const creatorResult = await query(
      'SELECT id FROM creators WHERE user_id = $1',
      [userId]
    );

    if (creatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      );
    }

    const creatorId = creatorResult.rows[0].id;

    // Get earnings data
    const earningsResult = await query(
      `SELECT COALESCE(SUM(amount_cents), 0) as total,
              COALESCE(SUM(CASE WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW()) THEN amount_cents ELSE 0 END), 0) as monthly
       FROM orders
       WHERE listing_id IN (SELECT id FROM listings WHERE creator_id = $1)`,
      [creatorId]
    );

    const totalEarnings = (earningsResult.rows[0]?.total || 0) / 100;
    const monthlyEarnings = (earningsResult.rows[0]?.monthly || 0) / 100;

    // Get subscriber counts (mock for now)
    const analyticsData = {
      analytics: {
        totalEarnings,
        monthlyEarnings,
        totalSubscribers: 42,
        newSubscribersThisMonth: 8,
        avgEngagementRate: 4.2,
        topPost: {
          title: 'Premium Selfie Collection',
          views: 1240,
        },
        subscriptionBreakdown: {
          tier5: 12,
          tier15: 18,
          tier25: 8,
          tier49: 4,
        },
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
