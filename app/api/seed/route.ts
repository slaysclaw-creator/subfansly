import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

// POST /api/seed - Seed creators and posts
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const CREATORS_DATA = [
    {
      displayName: 'Mei Chen',
      username: 'meichen',
      email: 'mei@subfansly.io',
      bio: '✨ AI-powered content creation. Beauty, lifestyle & exclusive content. Your favorite digital muse.',
      subscriptionPrice: 999,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeiChen&backgroundColor=ee4da4',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=MeiChenBanner&backgroundColor=ee4da4,8860d6',
      verified: true,
    },
    {
      displayName: 'Luna Sky',
      username: 'lunasky',
      email: 'luna@subfansly.io',
      bio: '🌙 Astronomer & night sky photographer. Weekly cosmic insights and astrophotography tips.',
      subscriptionPrice: 499,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaSky&backgroundColor=8860d6',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=LunaSkyBanner&backgroundColor=8860d6,ee4da4',
      verified: true,
    },
    {
      displayName: 'Alex Ryan',
      username: 'alexryan',
      email: 'alex@subfansly.io',
      bio: '🎬 Film director & cinematographer. Behind-the-scenes filmmaking content and tutorials.',
      subscriptionPrice: 1499,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRyan&backgroundColor=ee4da4',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AlexRyanBanner&backgroundColor=ee4da4,8860d6',
      verified: true,
    },
    {
      displayName: 'Jordan Blake',
      username: 'jordanblake',
      email: 'jordan@subfansly.io',
      bio: '🎨 Digital artist & illustrator. Daily art tutorials, commissions, and exclusive artwork.',
      subscriptionPrice: 799,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JordanBlake&backgroundColor=8860d6',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=JordanBlakeBanner&backgroundColor=8860d6,ee4da4',
      verified: false,
    },
    {
      displayName: 'Casey Morgan',
      username: 'caseymorgan',
      email: 'casey@subfansly.io',
      bio: '🏋️ Fitness coach & nutrition expert. Exclusive workout plans and meal prep guides.',
      subscriptionPrice: 1199,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaseyMorgan&backgroundColor=ee4da4',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=CaseyMorganBanner&backgroundColor=ee4da4,8860d6',
      verified: true,
    },
    {
      displayName: 'Sam Rivera',
      username: 'samrivera',
      email: 'sam@subfansly.io',
      bio: '🎵 Music producer & DJ. Weekly beats, production tutorials, and sample packs.',
      subscriptionPrice: 1499,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SamRivera&backgroundColor=8860d6',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=SamRiveraBanner&backgroundColor=8860d6,ee4da4',
      verified: true,
    },
    {
      displayName: 'Taylor Green',
      username: 'taylorgreen',
      email: 'taylor@subfansly.io',
      bio: '🌱 Sustainable living & eco-friendly lifestyle tips. Join my green journey!',
      subscriptionPrice: 599,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaylorGreen&backgroundColor=ee4da4',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=TaylorGreenBanner&backgroundColor=ee4da4,8860d6',
      verified: false,
    },
    {
      displayName: 'Morgan Lee',
      username: 'morganlee',
      email: 'morgan@subfansly.io',
      bio: '📚 Author & writing coach. Daily writing prompts, book insights, and storytelling tips.',
      subscriptionPrice: 999,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MorganLee&backgroundColor=8860d6',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=MorganLeeBanner&backgroundColor=8860d6,ee4da4',
      verified: true,
    },
    {
      displayName: 'Chris Taylor',
      username: 'christaylor',
      email: 'chris@subfansly.io',
      bio: '🎮 Gaming content creator. Stream highlights, game reviews, and exclusive gaming tips.',
      subscriptionPrice: 1299,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChrisTaylor&backgroundColor=ee4da4',
      bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChrisTaylorBanner&backgroundColor=ee4da4,8860d6',
      verified: true,
    },
  ];

  const POST_TEMPLATES = [
    { title: '✨ Today\'s Exclusive Behind-the-Scenes', content: 'This week\'s exclusive content is ready! Check out the detailed breakdown and let me know what you think in the comments!' },
    { title: '🌟 Weekly Creator Insights & Tips', content: 'Excited to share what I\'ve been working on. Your support makes this possible! Here are my top tips for the week.' },
    { title: '💎 Premium Content Drop', content: 'Here\'s something special for all my subscribers. Thank you for the amazing support! This one took a lot of work.' },
    { title: '🚀 Project Announcement!', content: 'Working on something big. Stay tuned for exclusive updates! I can\'t wait to show you what\'s coming.' },
    { title: '📸 New Photo Collection Released', content: 'Happy to share this new collection with you all. Enjoy! Shot this over the weekend - hope you love it!' },
    { title: '💫 Community Spotlight', content: 'Your feedback means everything. Thank you for being part of this journey! Shoutout to all my amazing supporters.' },
  ];

  try {
    const results = { users: 0, creators: 0, posts: 0 };

    for (const creator of CREATORS_DATA) {
      // Check if user exists
      const userCheck = await query(
        'SELECT id FROM users WHERE email = $1',
        [creator.email]
      );

      let userId: number;

      if (userCheck.rows.length === 0) {
        // Create user with hashed password
        const hashedPassword = await bcrypt.hash('password123', 10);
        const userResult = await query(
          'INSERT INTO users (username, email, password_hash, is_creator) VALUES ($1, $2, $3, true) RETURNING id',
          [creator.username, creator.email, hashedPassword]
        );
        userId = userResult.rows[0].id;
        results.users++;
      } else {
        userId = userCheck.rows[0].id;
      }

      // Check if creator exists
      const creatorCheck = await query(
        'SELECT id FROM creators WHERE user_id = $1',
        [userId]
      );

      let creatorId: number;

      if (creatorCheck.rows.length === 0) {
        const subscribers = Math.floor(Math.random() * 800) + 100;
        const earnings = Math.floor(Math.random() * 8000) + 2000;

        const creatorResult = await query(
          `INSERT INTO creators (
            user_id, display_name, username, bio,
            subscription_price_monthly, avatar_url, banner_url,
            verification_status, total_subscribers, total_earnings
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [
            userId,
            creator.displayName,
            creator.username,
            creator.bio,
            creator.subscriptionPrice,
            creator.avatarUrl,
            creator.bannerUrl,
            creator.verified ? 'verified' : 'pending',
            subscribers,
            earnings,
          ]
        );
        creatorId = creatorResult.rows[0].id;
        results.creators++;
      } else {
        creatorId = creatorCheck.rows[0].id;
      }

      // Add posts for each creator
      for (let i = 0; i < 5; i++) {
        const template = POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
        const isPaid = Math.random() > 0.7;
        const likes = Math.floor(Math.random() * 150) + 20;
        const comments = Math.floor(Math.random() * 30);
        const daysAgo = Math.floor(Math.random() * 30);

        // Check if post exists
        const postCheck = await query(
          'SELECT id FROM posts WHERE creator_id = $1 AND title = $2',
          [creatorId, template.title]
        );

        if (postCheck.rows.length === 0) {
          await query(
            `INSERT INTO posts (
              creator_id, title, content, image_url,
              is_paid_only, price_cents, is_published,
              likes, comments, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - INTERVAL '${daysAgo} days')`,
            [
              creatorId,
              template.title,
              template.content,
              `https://api.dicebear.com/7.x/shapes/svg?seed=${creator.displayName}Post${i}&backgroundColor=ee4da4,8860d6`,
              isPaid,
              isPaid ? Math.floor(Math.random() * 800) + 199 : 0,
              true,
              likes,
              comments,
            ]
          );
          results.posts++;
        }
      }
    }

    return NextResponse.json({
      message: 'Seeding complete!',
      results,
      credentials: 'All accounts use password: password123',
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
