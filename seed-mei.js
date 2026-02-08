const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/subfansly',
});

async function hashPassword(password) {
  return require('bcryptjs').hash(password, 10);
}

async function seedMei() {
  console.log('Adding Mei Chen to subfansly with approved photos...');

  try {
    const password = await hashPassword('mei123456');

    // Create Mei user
    const userResult = await pool.query(
      `INSERT INTO users (username, email, password_hash, is_creator) 
       VALUES ($1, $2, $3, true) RETURNING id`,
      ['mei_chen', 'mei@subfansly.io', password]
    );
    const userId = userResult.rows[0].id;
    console.log('✓ User created:', userId);

    // Create Mei creator profile with first approved photo
    const creatorResult = await pool.query(
      `INSERT INTO creators (user_id, display_name, bio, avatar_url, banner_url, subscription_price_monthly, total_subscribers, total_earnings, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        userId,
        'Mei Chen',
        'Asian creator - Fashion & lifestyle. 6 exclusive selfie photos included.',
        'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-01.png',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
        12.99,
        0,
        0,
        'verified',
      ]
    );
    const creatorId = creatorResult.rows[0].id;
    console.log('✓ Creator profile:', creatorId);

    // Approved Mei photos (6 total)
    const approvedPhotos = [
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-01.png',
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-03.png',
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-04.png',
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-05.png',
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-06.png',
      'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-08.png',
    ];

    // Create Premium Selfie Collection listing
    const listing1 = await pool.query(
      `INSERT INTO listings (creator_id, title, description, price_cents)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        creatorId,
        'Premium Selfie Collection',
        'Access all 6 exclusive selfie photos. High quality, natural lighting, authentic bedroom aesthetic.',
        2999,
      ]
    );
    const listingId1 = listing1.rows[0].id;
    console.log('✓ Listing 1 created:', listingId1);

    // Create Monthly Bundle listing
    const listing2 = await pool.query(
      `INSERT INTO listings (creator_id, title, description, price_cents)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        creatorId,
        'Monthly Selfie Bundle',
        'Get 2 new exclusive selfies every month. Direct from Mei.',
        1299,
      ]
    );
    const listingId2 = listing2.rows[0].id;
    console.log('✓ Listing 2 created:', listingId2);

    console.log('\n✅ Mei Chen added to subfansly.com');
    console.log('   Creator ID:', creatorId);
    console.log('   User ID:', userId);
    console.log('   Approved photos: 6');
    console.log('   Listings: 2 ($29.99 + $12.99)');
    
    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding Mei:', error.message);
    await pool.end();
    process.exit(1);
  }
}

seedMei();
