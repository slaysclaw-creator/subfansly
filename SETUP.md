# fanplace.io - Setup & Deployment Guide

## Project Overview
fanplace.io is an OnlyFans-like creator subscription platform built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Git
- Vercel account (for deployment)

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb fanplace

# Run schema
psql fanplace < schema.sql

# Seed data (if using Node)
npm run seed
```

#### Option B: PostgreSQL Cloud (e.g., Neon, Supabase)
```bash
# Create database and tables using the schema.sql file
# Get your connection string
```

### 3. Environment Variables
Create `.env.local`:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fanplace

# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_key_change_in_production

# Stripe (mock for now)
NEXT_PUBLIC_STRIPE_KEY=pk_test_mock
STRIPE_SECRET_KEY=sk_test_mock

# Environment
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Demo Credentials

After seeding the database, use these credentials:

### Regular User
- Email: `john@example.com`
- Password: `password123`

### Creator User
- Email: `gpt.creative@fanplace.io`
- Password: `password123`

- Email: `ai.artist@fanplace.io`
- Password: `password123`

## Database Schema

### Tables
- **users** - Platform users
- **creators** - Creator profiles
- **posts** - User-generated content
- **subscriptions** - Creator subscriptions
- **transactions** - Payment history
- **messages** - DM system
- **collections** - Fans, Following, Restricted, Blocked lists
- **comments** - Post comments
- **notifications** - User notifications
- **post_likes** - Like tracking
- **comment_likes** - Comment like tracking

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Creators
- `GET /api/creators` - Get all creators
- `POST /api/creators` - Create creator profile
- `GET /api/creators/[id]` - Get creator profile
- `PUT /api/creators/[id]` - Update creator profile

### Posts
- `GET /api/posts` - Get posts (with pagination)
- `POST /api/posts` - Create new post

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Subscribe to creator

### Messages
- `GET /api/messages` - Get conversations/messages
- `POST /api/messages` - Send message

## Frontend Pages

- `/` - Home feed with creator suggestions
- `/login` - User login
- `/register` - User registration
- `/creator/[id]` - Creator profile page
- `/feed` - Full feed view
- `/notifications` - Notifications page
- `/messages` - Direct messaging
- `/subscriptions` - User's subscriptions
- `/wallet` - Earnings & payouts
- `/collections` - User collections (Fans, Following, etc.)
- `/dashboard` - Creator dashboard (post upload, analytics)

## Features Implemented

✅ User Authentication (Register/Login)
✅ Creator Profiles with customizable info
✅ Post Creation & Publishing
✅ Subscription System (60/40 split)
✅ Mock Stripe Integration
✅ Earnings Dashboard
✅ Direct Messaging (subscription-gated)
✅ Notification System
✅ Collections Management
✅ Creator Analytics
✅ Transaction History

## Payment Structure

- **Creator Earnings:** 60% of subscription fee
- **Platform Fee:** 40% of subscription fee
- **Example:** $9.99/month subscription = Creator gets $5.99, Platform gets $3.99

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel
1. Go to vercel.com
2. Import project from GitHub
3. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
4. Deploy

### 3. Database for Production
Use Neon, Supabase, or AWS RDS PostgreSQL:
```
DATABASE_URL=postgresql://user:password@host:5432/fanplace
```

## Next Steps / Future Enhancements

- [ ] Real Stripe integration (checkout.stripe.com)
- [ ] Payment webhook handling
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Content recommendations
- [ ] Tiered subscriptions ($4.99, $9.99, $49.99 variants)
- [ ] Comment system with likes
- [ ] Video upload support
- [ ] Creator verification system
- [ ] Referral program
- [ ] Content moderation tools
- [ ] Creator support/collaboration features
- [ ] Fan support/tip system
- [ ] Mobile app (React Native)

## File Structure

```
fanplace.io/
├── app/
│   ├── api/               # API routes
│   ├── creator/           # Creator pages
│   ├── dashboard/         # Creator dashboard
│   ├── feed/              # Feed page
│   ├── login/             # Auth pages
│   ├── messages/          # Messaging
│   ├── notifications/     # Notifications
│   ├── subscriptions/     # Subscriptions
│   ├── wallet/            # Earnings page
│   ├── collections/       # Collections page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── Navbar.tsx         # Navigation
├── lib/
│   ├── auth.ts            # Auth utilities
│   └── db.ts              # Database utilities
├── scripts/
│   └── seed.ts            # Database seeding
├── schema.sql             # Database schema
└── package.json           # Dependencies
```

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure firewall allows connections

### API Errors
- Check localStorage for valid token
- Verify Authorization header format
- Check server logs

### Build Errors
- Clear .next folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## Support

For issues or feature requests, check the GitHub repository or contact the development team.

## License

MIT License - See LICENSE file for details
