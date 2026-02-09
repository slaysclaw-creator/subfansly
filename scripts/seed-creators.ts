import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CREATORS_DATA = [
  {
    displayName: 'Mei Chen',
    username: 'meichen',
    email: 'mei@example.com',
    bio: '✨ AI-powered content creation. Beauty, lifestyle & exclusive content.',
    subscriptionPrice: 999,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeiChen',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=MeiChenBanner&backgroundColor=ee4da4,8860d6',
  },
  {
    displayName: 'Luna Sky',
    username: 'lunasky',
    email: 'luna@example.com',
    bio: '🌙 Astronomer & night sky photographer. Weekly cosmic insights.',
    subscriptionPrice: 499,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaSky',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=LunaSkyBanner&backgroundColor=8860d6,ee4da4',
  },
  {
    displayName: 'Alex Ryan',
    username: 'alexryan',
    email: 'alex@example.com',
    bio: '🎬 Film director & cinematographer. Behind-the-scenes filmmaking content.',
    subscriptionPrice: 1499,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRyan',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=AlexRyanBanner&backgroundColor=ee4da4,8860d6',
  },
  {
    displayName: 'Jordan Blake',
    username: 'jordanblake',
    email: 'jordan@example.com',
    bio: '🎨 Digital artist & illustrator. Daily art tutorials & commissions.',
    subscriptionPrice: 799,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JordanBlake',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=JordanBlakeBanner&backgroundColor=8860d6,ee4da4',
  },
  {
    displayName: 'Casey Morgan',
    username: 'caseymorgan',
    email: 'casey@example.com',
    bio: '🏋️ Fitness coach & nutrition expert. Exclusive workout plans.',
    subscriptionPrice: 1199,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaseyMorgan',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=CaseyMorganBanner&backgroundColor=ee4da4,8860d6',
  },
  {
    displayName: 'Sam Rivera',
    username: 'samrivera',
    email: 'sam@example.com',
    bio: '🎵 Music producer & DJ. Weekly beats and production tutorials.',
    subscriptionPrice: 1499,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SamRivera',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=SamRriveraBanner&backgroundColor=8860d6,ee4da4',
  },
  {
    displayName: 'Taylor Green',
    username: 'taylorgreen',
    email: 'taylor@example.com',
    bio: '🌱 Sustainable living & eco-friendly lifestyle. Tips & tricks.',
    subscriptionPrice: 599,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaylorGreen',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=TaylorGreenBanner&backgroundColor=ee4da4,8860d6',
  },
  {
    displayName: 'Morgan Lee',
    username: 'morganlee',
    email: 'morgan@example.com',
    bio: '📚 Author & writing coach. Daily writing prompts & book insights.',
    subscriptionPrice: 999,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MorganLee',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=MorganLeeBanner&backgroundColor=8860d6,ee4da4',
  },
  {
    displayName: 'Chris Taylor',
    username: 'christaylor',
    email: 'chris@example.com',
    bio: '🎮 Gaming content creator. Stream highlights & game reviews.',
    subscriptionPrice: 1299,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChrisTaylor',
    bannerUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ChrisTaylorBanner&backgroundColor=ee4da4,8860d6',
  },
];

const POST_TITLES = [
  '✨ Today\'s Exclusive Behind-the-Scenes',
  '🌟 Weekly Creator Insights & Tips',
  '💎 Premium Content Drop',
  '🚀 Project Announcement!',
  '📸 New Photo Collection Released',
  '💫 Community Spotlight',
];

const POST_CONTENT_SAMPLES = [
  'This week\'s exclusive content is ready! Check out the detailed breakdown in the full post.',
  'Excited to share what I\'ve been working on. Your support makes this possible!',
  'Here\'s something special for all my subscribers. Thank you for the amazing support!',
  'Working on something big. Stay tuned for exclusive updates!',
  'Happy to share this new collection with you all. Enjoy!',
  'Your feedback means everything. Thank you for being part of this journey!',
];

async function seedCreators() {
  try {
    console.log('Starting creator seeding...');

    // First, get or create users for each creator
    for (const creator of CREATORS_DATA) {
      // Check if user exists
      const userCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [creator.email]
      );

      let userId: number;

      if (userCheck.rows.length === 0) {
        // Create user
        const userResult = await pool.query(
          'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
          [creator.username, creator.email, 'hashed_password_placeholder']
        );
        userId = userResult.rows[0].id;
        console.log(`✓ Created user: ${creator.username}`);
      } else {
        userId = userCheck.rows[0].id;
        console.log(`✓ User exists: ${creator.username}`);
      }

      // Check if creator exists
      const creatorCheck = await pool.query(
        'SELECT id FROM creators WHERE user_id = $1',
        [userId]
      );

      let creatorId: number;

      if (creatorCheck.rows.length === 0) {
        // Create creator
        const creatorResult = await pool.query(
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
            creator.displayName === 'Mei Chen' ? 'verified' : 'verified',
            Math.floor(Math.random() * 500) + 50,
            Math.floor(Math.random() * 5000) + 1000,
          ]
        );
        creatorId = creatorResult.rows[0].id;
        console.log(`✓ Created creator: ${creator.displayName}`);
      } else {
        creatorId = creatorCheck.rows[0].id;
        console.log(`✓ Creator exists: ${creator.displayName}`);
      }

      // Add sample posts for each creator
      for (let i = 0; i < 5; i++) {
        const titleIndex = Math.floor(Math.random() * POST_TITLES.length);
        const contentIndex = Math.floor(Math.random() * POST_CONTENT_SAMPLES.length);

        const postCheck = await pool.query(
          'SELECT id FROM posts WHERE creator_id = $1 AND title = $2 LIMIT 1',
          [creatorId, POST_TITLES[titleIndex]]
        );

        if (postCheck.rows.length === 0) {
          await pool.query(
            `INSERT INTO posts (
              creator_id, title, content, image_url,
              is_paid_only, price_cents, is_published,
              likes, comments, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              creatorId,
              POST_TITLES[titleIndex],
              POST_CONTENT_SAMPLES[contentIndex],
              `https://api.dicebear.com/7.x/shapes/svg?seed=${creator.displayName}Post${i}&backgroundColor=ee4da4,8860d6`,
              Math.random() > 0.7, // 30% paid content
              Math.random() > 0.7 ? Math.floor(Math.random() * 1000) + 99 : 0,
              true,
              Math.floor(Math.random() * 200) + 10,
              Math.floor(Math.random() * 50),
              new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            ]
          );
        }
      }
    }

    console.log('✓ Seeding complete!');
    console.log(`\nSeeded ${CREATORS_DATA.length} creators with posts.`);
    console.log('\nTest accounts:');
    CREATORS_DATA.forEach((creator) => {
      console.log(`  ${creator.email} (${creator.displayName})`);
    });
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedCreators();
