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
      'SELECT id, total_subscribers, total_earnings FROM creators WHERE user_id = $1',
      [userId]
    );

    if (creatorResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Creator profile not found' },
        { status: 404 }
      );
    }

    const creator = creatorResult.rows[0];
    const creatorId = creator.id;

    // Get real subscription breakdown by tier
    const tierBreakdownResult = await query(
      `SELECT subscription_tier, COUNT(*) as count
       FROM subscriptions
       WHERE creator_id = $1 AND is_active = true
       GROUP BY subscription_tier`,
      [creatorId]
    );

    const tierBreakdown: Record<string, number> = {
      tier5: 0,
      tier15: 0,
      tier25: 0,
      tier49: 0,
    };

    tierBreakdownResult.rows.forEach((row: any) => {
      const tier = row.subscription_tier;
      if (tierBreakdown.hasOwnProperty(tier)) {
        tierBreakdown[tier] = parseInt(row.count);
      }
    });

    // Get new subscribers this month
    const newSubsResult = await query(
      `SELECT COUNT(*) as count
       FROM subscriptions
       WHERE creator_id = $1 
         AND started_at >= DATE_TRUNC('month', NOW())`,
      [creatorId]
    );

    const newSubscribersThisMonth = parseInt(newSubsResult.rows[0]?.count || 0);

    // Get monthly earnings from transactions
    const monthlyEarningsResult = await query(
      `SELECT COALESCE(SUM(creator_earnings), 0) as total
       FROM transactions
       WHERE creator_id = $1 
         AND created_at >= DATE_TRUNC('month', NOW())
         AND status = 'completed'`,
      [creatorId]
    );

    const monthlyEarnings = parseFloat(monthlyEarningsResult.rows[0]?.total || 0) / 100;

    // Get top performing post
    const topPostResult = await query(
      `SELECT title, COALESCE(likes, 0) + COALESCE(comments, 0) * 2 as engagement
       FROM posts
       WHERE creator_id = $1 AND is_published = true
       ORDER BY engagement DESC
       LIMIT 1`,
      [creatorId]
    );

    const topPost = topPostResult.rows[0] 
      ? { title: topPostResult.rows[0].title, views: parseInt(topPostResult.rows[0].engagement) * 10 }
      : { title: 'No posts yet', views: 0 };

    // Get engagement rate (likes + comments / total posts)
    const engagementResult = await query(
      `SELECT 
         COALESCE(AVG(COALESCE(likes, 0) + COALESCE(comments, 0)), 0) as avg_engagement,
         COUNT(*) as post_count
       FROM posts
       WHERE creator_id = $1 AND is_published = true`,
      [creatorId]
    );

    const avgEngagement = parseFloat(engagementResult.rows[0]?.avg_engagement || 0);
    const postCount = parseInt(engagementResult.rows[0]?.post_count || 0);
    const engagementRate = postCount > 0 ? (avgEngagement / Math.max(creator.total_subscribers, 1)) * 100 : 0;

    // Get earnings chart data (last 7 days)
    const earningsChartResult = await query(
      `SELECT DATE(created_at) as date, COALESCE(SUM(creator_earnings), 0) as amount
       FROM transactions
       WHERE creator_id = $1 
         AND created_at >= NOW() - INTERVAL '7 days'
         AND status = 'completed'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [creatorId]
    );

    const earningsChart = earningsChartResult.rows.map((row: any) => ({
      date: row.date,
      amount: parseFloat(row.amount) / 100,
    }));

    // Get recent subscribers
    const recentSubsResult = await query(
      `SELECT u.username, u.avatar_url, s.subscription_tier, s.started_at
       FROM subscriptions s
       JOIN users u ON s.user_id = u.id
       WHERE s.creator_id = $1 AND s.is_active = true
       ORDER BY s.started_at DESC
       LIMIT 5`,
      [creatorId]
    );

    const recentSubscribers = recentSubsResult.rows.map((row: any) => ({
      username: row.username,
      avatarUrl: row.avatar_url,
      tier: row.subscription_tier,
      startedAt: row.started_at,
    }));

    // Get post performance
    const postsPerformanceResult = await query(
      `SELECT id, title, COALESCE(likes, 0) as likes, COALESCE(comments, 0) as comments, created_at
       FROM posts
       WHERE creator_id = $1 AND is_published = true
       ORDER BY created_at DESC
       LIMIT 5`,
      [creatorId]
    );

    const recentPosts = postsPerformanceResult.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      likes: parseInt(row.likes),
      comments: parseInt(row.comments),
      createdAt: row.created_at,
    }));

    const analyticsData = {
      analytics: {
        totalEarnings: parseFloat(creator.total_earnings || 0) / 100,
        monthlyEarnings,
        totalSubscribers: parseInt(creator.total_subscribers || 0),
        newSubscribersThisMonth,
        avgEngagementRate: Math.min(engagementRate, 100),
        topPost,
        subscriptionBreakdown: tierBreakdown,
        earningsChart,
        recentSubscribers,
        recentPosts,
        postCount,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
