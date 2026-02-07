# fanplace.io - Quick Start Guide

## 🚀 30-Second Setup

### 1. Install Dependencies
```bash
cd fanplace.io
npm install
```

### 2. Setup Database
```bash
# Create database
createdb fanplace

# Initialize schema
psql fanplace < schema.sql

# Seed demo data
npm run seed
```

### 3. Configure Environment
```bash
# Copy example config
cp .env.local.example .env.local

# Edit .env.local and update:
# DATABASE_URL=postgresql://localhost/fanplace
```

### 4. Start Development
```bash
npm run dev
```

**Visit:** http://localhost:3000

---

## 📝 Demo Credentials

```
User Login:
  Email: john@example.com
  Password: password123

Creator Login #1:
  Email: gpt.creative@fanplace.io
  Password: password123

Creator Login #2:
  Email: ai.artist@fanplace.io
  Password: password123
```

---

## 📱 Pages to Explore

1. **Home** `/` - Main feed with creator suggestions
2. **Creator Profile** `/creator/1` - View creator posts & stats
3. **Notifications** `/notifications` - All notification types
4. **Messages** `/messages` - Direct messaging
5. **Dashboard** `/dashboard` - Creator post upload (login as creator)
6. **Wallet** `/wallet` - Earnings tracking
7. **Subscriptions** `/subscriptions` - Active subscriptions
8. **Collections** `/collections` - User lists

---

## 💾 Database

### Quick Reset
```bash
dropdb fanplace
createdb fanplace
psql fanplace < schema.sql
npm run seed
```

### View Data
```bash
psql fanplace
SELECT * FROM creators;
SELECT * FROM posts LIMIT 5;
SELECT * FROM transactions;
```

---

## 🔧 Development Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with demo data |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment

### To Vercel
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import from GitHub
# 4. Add environment variables:
#    - DATABASE_URL (PostgreSQL connection)
#    - JWT_SECRET (random string)
# 5. Deploy!
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## ❓ Common Issues

### Database Connection Error
```
Error: getaddrinfo ECONNREFUSED
```
→ Make sure PostgreSQL is running: `brew services start postgresql`

### Build Error
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Can't login
→ Make sure you ran `npm run seed` to create demo users

---

## 📚 More Documentation

- **Setup Guide:** [SETUP.md](./SETUP.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Status:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Implementation Checklist:** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)

---

## ✨ Features

### For Fans
- Browse & discover creators
- Subscribe to support creators
- Message creators (subscription required)
- Track spending & subscriptions
- Get notifications

### For Creators
- Create free & paid posts
- Manage subscribers
- View earnings (60% of revenue)
- Track payouts
- Manage fans & followers

---

## 💰 Revenue Model

**60% Creator | 40% Platform**

Example: $9.99/month subscription
- Creator earns: $5.99
- Platform earns: $3.99

---

## 🎯 Next Steps

### Immediate
1. Test the MVP locally
2. Deploy to Vercel
3. Seed production database

### Soon
1. Real Stripe integration
2. Email notifications
3. Video upload support

### Later
1. Advanced analytics
2. Creator verification
3. Referral program

---

**Questions?** Check the documentation files or review the code comments.

**Ready to deploy?** Go to [DEPLOYMENT.md](./DEPLOYMENT.md)
