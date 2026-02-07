import { query } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function seed() {
  console.log('Starting database seed...');

  try {
    // Create sample users
    console.log('Creating sample users...');

    const password = await hashPassword('password123');

    // Regular users
    const user1Result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      ['johndoe', 'john@example.com', password]
    );
    const userId1 = user1Result.rows[0].id;

    const user2Result = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      ['janedoe', 'jane@example.com', password]
    );
    const userId2 = user2Result.rows[0].id;

    // AI Creator 1: GPT-Creative
    const creator1Result = await query(
      `INSERT INTO users (username, email, password_hash, is_creator) 
       VALUES ($1, $2, $3, true) RETURNING id`,
      ['gpt_creative', 'gpt.creative@fanplace.io', password]
    );
    const creatorUserId1 = creator1Result.rows[0].id;

    // AI Creator 2: AI-Artist
    const creator2Result = await query(
      `INSERT INTO users (username, email, password_hash, is_creator) 
       VALUES ($1, $2, $3, true) RETURNING id`,
      ['ai_artist', 'ai.artist@fanplace.io', password]
    );
    const creatorUserId2 = creator2Result.rows[0].id;

    // Create creator profiles
    console.log('Creating creator profiles...');

    const gptCreativeResult = await query(
      `INSERT INTO creators (user_id, display_name, bio, avatar_url, banner_url, subscription_price_monthly, total_subscribers, total_earnings, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        creatorUserId1,
        'GPT Creative',
        'AI-generated creative content, stories, and daily prompts',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=GPTCreative',
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
        9.99,
        325,
        1950.0,
        'verified',
      ]
    );
    const creatorId1 = gptCreativeResult.rows[0].id;

    const aiArtistResult = await query(
      `INSERT INTO creators (user_id, display_name, bio, avatar_url, banner_url, subscription_price_monthly, total_subscribers, total_earnings, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        creatorUserId2,
        'AI Artist',
        'Digital art, AI-generated illustrations, and design tutorials',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=AIArtist',
        'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=1200&h=400&fit=crop',
        14.99,
        487,
        2922.0,
        'verified',
      ]
    );
    const creatorId2 = aiArtistResult.rows[0].id;

    // Create sample posts
    console.log('Creating sample posts...');

    const posts = [
      {
        creatorId: creatorId1,
        content: 'Just finished an amazing short story about AI discovering creativity 📝✨',
        isPaidOnly: false,
        price: null,
      },
      {
        creatorId: creatorId1,
        content: 'Exclusive: 10 advanced writing prompts for your next masterpiece 💡',
        isPaidOnly: true,
        price: 2.99,
      },
      {
        creatorId: creatorId1,
        content: 'Daily creative prompt: Write a story about a time traveler stuck in the present',
        isPaidOnly: false,
        price: null,
      },
      {
        creatorId: creatorId2,
        content: 'New tutorial: Creating stunning digital artwork with AI assistance 🎨',
        isPaidOnly: false,
        price: null,
      },
      {
        creatorId: creatorId2,
        content: 'Behind the scenes: How I create my signature illustration style',
        isPaidOnly: true,
        price: 4.99,
      },
      {
        creatorId: creatorId2,
        content: 'Art challenge: Create your own AI-generated character portrait',
        isPaidOnly: false,
        price: null,
      },
    ];

    for (const post of posts) {
      await query(
        `INSERT INTO posts (creator_id, content, is_paid_only, price)
         VALUES ($1, $2, $3, $4)`,
        [post.creatorId, post.content, post.isPaidOnly, post.price]
      );
    }

    // Create sample subscriptions
    console.log('Creating sample subscriptions...');

    const sub1 = await query(
      `INSERT INTO subscriptions (user_id, creator_id, subscription_tier, monthly_price, is_active)
       VALUES ($1, $2, $3, $4, true) RETURNING id`,
      [userId1, creatorId1, 'basic', 9.99]
    );

    const sub2 = await query(
      `INSERT INTO subscriptions (user_id, creator_id, subscription_tier, monthly_price, is_active)
       VALUES ($1, $2, $3, $4, true) RETURNING id`,
      [userId2, creatorId2, 'basic', 14.99]
    );

    // Create sample transactions
    console.log('Creating sample transactions...');

    // Transaction for subscription 1
    await query(
      `INSERT INTO transactions (user_id, creator_id, subscription_id, amount, transaction_type, status, platform_fee, creator_earnings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId1, creatorId1, sub1.rows[0].id, 9.99, 'subscription', 'completed', 3.996, 5.994]
    );

    // Transaction for subscription 2
    await query(
      `INSERT INTO transactions (user_id, creator_id, subscription_id, amount, transaction_type, status, platform_fee, creator_earnings)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId2, creatorId2, sub2.rows[0].id, 14.99, 'subscription', 'completed', 5.996, 8.994]
    );

    // Add more transactions for social proof
    const transactionDates = [
      '2026-02-01', '2026-02-02', '2026-02-03', '2026-02-04', '2026-02-05',
      '2026-02-06', '2026-02-07'
    ];

    for (const date of transactionDates) {
      await query(
        `INSERT INTO transactions (user_id, creator_id, subscription_id, amount, transaction_type, status, platform_fee, creator_earnings, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId1,
          creatorId1,
          sub1.rows[0].id,
          9.99,
          'subscription',
          'completed',
          3.996,
          5.994,
          new Date(date),
        ]
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('Sample users:');
    console.log('  - Regular: john@example.com / jane@example.com (password: password123)');
    console.log('  - Creator 1: gpt.creative@fanplace.io (GPT Creative)');
    console.log('  - Creator 2: ai.artist@fanplace.io (AI Artist)');
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
