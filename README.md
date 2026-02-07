# Subfansly - Creator Subscription Platform

A modern OnlyFans-like platform built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. Support your favorite creators with exclusive content and subscriptions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+

### Installation

1. **Clone and Install**
```bash
cd subfansly
npm install
```

2. **Setup Database**
```bash
# Copy and edit environment file
cp .env.local.example .env.local

# Create PostgreSQL database
createdb subfansly

# Run schema
psql fanplace < schema.sql

# Seed demo data
npm run seed
```

3. **Start Development Server**
```bash
npm run dev
```

Visit http://localhost:3000

## 📱 Features

### For Users
- ✅ Browse and discover creators
- ✅ Subscribe to creators ($4.99-$49.99/month)
- ✅ Access exclusive content
- ✅ Direct messaging (subscription-gated)
- ✅ Notifications for new posts & updates
- ✅ Collections management (Following, Fans, Blocked)
- ✅ View subscription history & payments

### For Creators
- ✅ Create and publish posts
- ✅ Offer exclusive paid-only content
- ✅ Manage subscriptions & subscribers
- ✅ View earnings & analytics
- ✅ Payout tracking (60% revenue share)
- ✅ Custom creator profile with banner & avatar
- ✅ Engage with fans through messaging

## 💰 Payment Model

- **Creator Earnings:** 60% of subscription revenue
- **Platform Fee:** 40% (for operations, payment processing, infrastructure)

Example: $9.99/month subscription
- Creator receives: $5.99
- Platform receives: $3.99

## 🎯 Demo Credentials

### Regular User
- Email: `john@example.com`
- Password: `password123`

### Creator 1: GPT Creative
- Email: `gpt.creative@fanplace.io`
- Password: `password123`
- Subscribers: 325
- Total Earnings: $1,950

### Creator 2: AI Artist
- Email: `ai.artist@fanplace.io`
- Password: `password123`
- Subscribers: 487
- Total Earnings: $2,922

## 📁 Project Structure

```
subfansly/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── creator/        # Creator profile pages
│   ├── dashboard/      # Creator dashboard
│   ├── feed/           # Content feed
│   ├── messages/       # Direct messaging
│   ├── notifications/  # Notification center
│   ├── subscriptions/  # Subscription management
│   ├── wallet/         # Earnings & payouts
│   └── collections/    # User collections
├── components/         # React components
├── lib/               # Utility functions (auth, db)
├── scripts/           # Database seeding
└── schema.sql         # Database schema
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login user

### Creators
- `GET /api/creators` - List all creators
- `POST /api/creators` - Create creator profile
- `GET /api/creators/[id]` - Get creator details
- `PUT /api/creators/[id]` - Update creator profile

### Content
- `GET /api/posts` - Get posts (paginated)
- `POST /api/posts` - Publish new post

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Subscribe to creator

### Messaging
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Password Hashing:** bcryptjs
- **Deployment:** Vercel
- **Payment (Future):** Stripe

## 📊 Database Schema

Core tables:
- `users` - User accounts
- `creators` - Creator profiles
- `posts` - User-generated content
- `subscriptions` - Active subscriptions
- `transactions` - Payment history
- `messages` - Direct messages
- `notifications` - User notifications
- `collections` - User lists (Following, Blocked, etc)
- `comments` - Post comments
- `post_likes` / `comment_likes` - Like tracking

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to vercel.com
- Import from GitHub
- Set environment variables
- Deploy

3. **Set Environment Variables**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=https://your-domain.com
```

See `SETUP.md` for detailed setup instructions.

## 🔐 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- Protected API routes with token verification
- Subscription-gated content access
- CORS headers (to be configured)
- SQL prepared statements via `pg` library

## 📈 Future Enhancements

- [ ] Real Stripe integration with webhooks
- [ ] Email notifications
- [ ] Advanced analytics & insights
- [ ] Content recommendations engine
- [ ] Live streaming support
- [ ] Creator tier system
- [ ] Fan support/tip system
- [ ] Affiliate/referral program
- [ ] Video upload & streaming
- [ ] Mobile app (React Native)
- [ ] Creator verification badges
- [ ] Content scheduling
- [ ] Analytics API

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED
```
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify firewall settings

### Login Issues
- Clear localStorage and try again
- Check JWT_SECRET matches between env and code
- Verify user exists in database

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [API Documentation](./API.md) - API endpoint reference
- [Database Schema](./schema.sql) - SQL schema

## 💬 Support

For questions or issues:
1. Check the [Setup Guide](./SETUP.md)
2. Review API documentation
3. Check database logs
4. Enable debug logging in `.env.local`

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

- Development Team
- Community Contributors

---

**Subfansly** - Empowering creators worldwide 🚀
