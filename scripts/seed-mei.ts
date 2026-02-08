import { query } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function seedMei() {
  console.log('Adding Mei to subfansly...');

  try {
    const password = await hashPassword('mei123456');

    // Create Mei user
    const userResult = await query(
      `INSERT INTO users (username, email, password_hash, is_creator) 
       VALUES ($1, $2, $3, true) RETURNING id`,
      ['mei_chen', 'mei@subfansly.io', password]
    );
    const userId = userResult.rows[0].id;
    console.log('✓ Created user:', userId);

    // Create Mei creator profile
    const creatorResult = await query(
      `INSERT INTO creators (user_id, display_name, bio, avatar_url, banner_url, subscription_price_monthly, total_subscribers, total_earnings, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        userId,
        'Mei Chen',
        'Asian creator - Fashion, lifestyle, and exclusive content bundles',
        'https://ai-creators.r2.cloudflarestorage.com/mei/2026-02-08-mei-selfie-01.png',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
        12.99,
        0,
        0,
        'verified',
      ]
    );
    const creatorId = creatorResult.rows[0].id;
    console.log('✓ Created creator profile:', creatorId);

    // Create listings for Mei
    const listing1 = await query(
      `INSERT INTO listings (creator_id, title, description, price_cents)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        creatorId,
        'Selfie Collection - Premium',
        '6 exclusive selfie photos in high quality. Natural lighting, authentic bedroom aesthetic.',
        2999,
      ]
    );
    console.log('✓ Created listing 1:', listing1.rows[0].id);

    const listing2 = await query(
      `INSERT INTO listings (creator_id, title, description, price_cents)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [
        creatorId,
        'Monthly Selfie Bundle',
        'Get 2 new exclusive selfies every month. Direct from Mei.',
        1299,
      ]
    );
    console.log('✓ Created listing 2:', listing2.rows[0].id);

    console.log('\n✅ Mei successfully added to subfansly.com');
    console.log('   Creator ID:', creatorId);
    console.log('   User ID:', userId);
  } catch (error) {
    console.error('Error seeding Mei:', error);
    throw error;
  }
}

seedMei().catch(console.error);
