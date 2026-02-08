# subfansly.com Deployment Guide

## Quick Deploy (5 minutes)

### 1. Create Vercel Project
```bash
cd C:\Users\Windows 11 Pro\.openclaw\workspace\subfansly
vercel login
vercel
```
- Project name: `subfansly`
- Framework: Next.js
- Root: `.`

### 2. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/subfansly
JWT_SECRET=your-jwt-secret-key-here
NEXT_PUBLIC_API_URL=https://subfansly.vercel.app

STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Seed Database
```bash
npm run seed
node seed-mei.js  # Add Mei Chen
```

### 4. Deploy
```bash
vercel --prod
```

### 5. Configure Stripe Webhook
- Stripe Dashboard → Webhooks
- Add endpoint: `https://subfansly.vercel.app/api/payments/webhook`
- Events: `checkout.session.completed`, `charge.refunded`

### 6. Configure Custom Domain
- Vercel Dashboard → Domains
- Add: `subfansly.com`
- Update DNS (already configured in GoDaddy)

## Database Setup
Need PostgreSQL instance:
- **Option A:** Supabase (free tier) - 500MB, $25/month after
- **Option B:** Railway.app - $5/month starter
- **Option C:** AWS RDS - ~$30/month

Recommended: Supabase (easiest setup)

### Supabase Setup:
1. Create account at supabase.com
2. New project → Copy DATABASE_URL
3. Paste into Vercel env vars
4. `npm run seed` to populate

## Auto-Deploy
Push to `main` → Vercel auto-deploys
