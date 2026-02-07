-- Seed data for Sophia Blake creator profile
-- Add to existing creators in fanplace.io database

-- 1. Create user account for Sophia Blake
INSERT INTO users (username, email, password_hash, avatar_url, bio, is_creator)
VALUES (
  'sophia.blake',
  'sophia.blake@fanplace.io',
  'hashed_password_placeholder_sophia',
  'https://manageaicreators.com/creators/sophia-blake/avatar.jpg',
  'Luxury lifestyle & fitness enthusiast 💎 Exclusive content & wellness routines',
  TRUE
) RETURNING id;

-- 2. Create creator profile (use user_id from above, assume id = 3)
INSERT INTO creators (user_id, display_name, avatar_url, banner_url, bio, subscription_price_monthly, total_subscribers, total_earnings, verification_status)
VALUES (
  3,
  'Sophia Blake',
  'https://manageaicreators.com/creators/sophia-blake/avatar.jpg',
  'https://manageaicreators.com/creators/sophia-blake/banner.jpg',
  'Luxury lifestyle creator sharing daily wellness, fitness routines, travel, and exclusive behind-the-scenes content. Premium subscriber access to personalized fitness plans and VIP content.',
  19.99,
  0,
  0.00,
  'verified'
);

-- 3. Create initial posts for Sophia Blake (creator_id = 3)

-- Post 1: Free teaser - Morning routine
INSERT INTO posts (creator_id, content, image_url, is_paid_only, likes_count, comments_count, created_at)
VALUES (
  3,
  '☀️ Start your day right! My morning routine keeps me energized all day long. What''s in YOUR morning routine? 💪',
  'https://manageaicreators.com/creators/sophia-blake/posts/morning-routine.jpg',
  FALSE,
  342,
  28,
  CURRENT_TIMESTAMP - INTERVAL '5 days'
);

-- Post 2: Free teaser - Fitness motivation
INSERT INTO posts (creator_id, content, image_url, is_paid_only, likes_count, comments_count, created_at)
VALUES (
  3,
  '💪 Consistency over perfection. Progress isn''t always linear, but it''s always worth it. You''ve got this! #FitnessJourney',
  'https://manageaicreators.com/creators/sophia-blake/posts/fitness-motivation.jpg',
  FALSE,
  598,
  67,
  CURRENT_TIMESTAMP - INTERVAL '4 days'
);

-- Post 3: Paid exclusive - Full workout routine (subscribers only)
INSERT INTO posts (creator_id, content, image_url, video_url, is_paid_only, price, likes_count, comments_count, created_at)
VALUES (
  3,
  '🔥 EXCLUSIVE: 30-minute full-body workout routine. This is what I do 4x per week to stay fit and healthy. Detailed form tips + modifications included!',
  'https://manageaicreators.com/creators/sophia-blake/posts/workout-thumb.jpg',
  'https://manageaicreators.com/creators/sophia-blake/posts/full-body-workout.mp4',
  TRUE,
  9.99,
  412,
  89,
  CURRENT_TIMESTAMP - INTERVAL '3 days'
);

-- Post 4: Free teaser - Lifestyle
INSERT INTO posts (creator_id, content, image_url, is_paid_only, likes_count, comments_count, created_at)
VALUES (
  3,
  '✨ Luxury doesn''t always mean expensive—it''s about quality, intention, and living your best life. What does luxury mean to you?',
  'https://manageaicreators.com/creators/sophia-blake/posts/luxury-lifestyle.jpg',
  FALSE,
  723,
  142,
  CURRENT_TIMESTAMP - INTERVAL '2 days'
);

-- Post 5: Paid exclusive - Nutrition & meal prep guide
INSERT INTO posts (creator_id, content, image_url, video_url, is_paid_only, price, likes_count, comments_count, created_at)
VALUES (
  3,
  '🥗 EXCLUSIVE: Weekly meal prep guide. I show you exactly how I meal prep for the week, shopping list, recipes, macro breakdowns & cost breakdown.',
  'https://manageaicreators.com/creators/sophia-blake/posts/meal-prep-thumb.jpg',
  'https://manageaicreators.com/creators/sophia-blake/posts/meal-prep-guide.mp4',
  TRUE,
  7.99,
  287,
  56,
  CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- Post 6: Free teaser - Travel
INSERT INTO posts (creator_id, content, image_url, is_paid_only, likes_count, comments_count, created_at)
VALUES (
  3,
  '🌍 Just got back from an incredible week in Bali. Full travel vlog + behind-the-scenes content coming to my premium feed! Subscribe to see everything 🎥',
  'https://manageaicreators.com/creators/sophia-blake/posts/bali-teaser.jpg',
  FALSE,
  892,
  203,
  CURRENT_TIMESTAMP
);

-- Post 7: Paid exclusive - Behind-the-scenes daily vlog
INSERT INTO posts (creator_id, content, image_url, video_url, is_paid_only, price, likes_count, comments_count, created_at)
VALUES (
  3,
  '🎥 EXCLUSIVE: 45-minute unfiltered daily vlog. A day in my life—morning to night. Fitness, meals, work, self-care, real talk about staying consistent.',
  'https://manageaicreators.com/creators/sophia-blake/posts/daily-vlog-thumb.jpg',
  'https://manageaicreators.com/creators/sophia-blake/posts/daily-vlog.mp4',
  TRUE,
  4.99,
  156,
  34,
  CURRENT_TIMESTAMP - INTERVAL '6 hours'
);

-- Post 8: Free teaser - Wellness tips
INSERT INTO posts (creator_id, content, image_url, is_paid_only, likes_count, comments_count, created_at)
VALUES (
  3,
  '🧘‍♀️ 5 wellness habits that changed my life: 1) Sleep 2) Hydration 3) Movement 4) Meditation 5) Community. Which one do you need most right now?',
  'https://manageaicreators.com/creators/sophia-blake/posts/wellness-tips.jpg',
  FALSE,
  1045,
  267,
  CURRENT_TIMESTAMP - INTERVAL '3 hours'
);

-- 4. Add some sample subscribers (John subscribes to Sophia)
-- Assuming john has user_id = 1
INSERT INTO subscriptions (user_id, creator_id, subscription_tier, monthly_price, is_active, started_at, renewal_at)
VALUES (
  1,
  3,
  'premium',
  19.99,
  TRUE,
  CURRENT_TIMESTAMP - INTERVAL '10 days',
  CURRENT_TIMESTAMP + INTERVAL '20 days'
);

-- 5. Update creator stats
-- UPDATE creators SET total_subscribers = 1, total_earnings = 19.99 WHERE id = 3;
