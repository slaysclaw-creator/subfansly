# Deployment Guide - fanplace.io

## Prerequisites
- Vercel account
- PostgreSQL database (Neon, Supabase, or AWS RDS)
- GitHub account

## Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: fanplace.io MVP"
git remote add origin https://github.com/YOUR_USERNAME/fanplace.io.git
git push -u origin main
```

## Step 2: Create PostgreSQL Database

### Option A: Neon (Recommended)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string (looks like: `postgresql://user:password@host/dbname`)

### Option B: Supabase
1. Go to https://supabase.com
2. Create new project
3. Run schema.sql in SQL editor
4. Copy connection string from settings

### Option C: AWS RDS
1. Create RDS PostgreSQL instance
2. Create database `fanplace`
3. Run schema.sql via psql or management console

## Step 3: Deploy to Vercel

### Via Web UI (Easiest)
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=generate_random_secret_here
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_STRIPE_KEY=pk_test_... (optional for now)
   STRIPE_SECRET_KEY=sk_test_... (optional for now)
   ```
6. Click "Deploy"

### Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when prompted.

## Step 4: Initialize Database

After deployment, run seed script:

```bash
# Access Vercel deployment
vercel env pull  # Downloads environment variables locally

# You can also manually run seed via API
# Or use a direct database connection tool
```

To seed data after deployment:

1. **Option A: Direct Database Connection**
```bash
# Using psql (replace with your connection string)
psql postgresql://user:password@host:5432/fanplace < schema.sql
ts-node scripts/seed.ts
```

2. **Option B: Create Seed API Route (Recommended)**
Create `app/api/seed/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  // Add seed logic here
  // This allows one-time seeding via API call
  return NextResponse.json({ message: 'Seeded' });
}
```

## Step 5: Verify Deployment

1. Visit your Vercel domain
2. Test user registration
3. Test creator login with demo credentials
4. Check if posts load
5. Test subscription functionality

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `super_secret_key_32chars_min` |
| `NEXT_PUBLIC_API_URL` | API base URL | No | `https://fanplace.vercel.app` |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | No | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | No | `sk_test_...` |
| `NODE_ENV` | Environment | No | `production` |

## Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records (detailed instructions provided by Vercel)
4. Update `NEXT_PUBLIC_API_URL` in environment variables

## SSL Certificate

Vercel automatically provides free SSL certificates for all deployments.

## Monitoring & Logs

### View Logs in Vercel
1. Go to your project
2. Click "Deployments"
3. Select latest deployment
4. Click "Runtime logs"

### Enable Debug Mode
Add to `.env` in Vercel:
```
DEBUG=*
```

## Scaling Considerations

### As User Base Grows
1. Upgrade PostgreSQL plan (Neon scales automatically)
2. Add database indexes (already in schema.sql)
3. Implement caching layer (Redis)
4. Use CDN for static assets (Vercel CDN included)
5. Consider serverless functions optimization

## Cost Estimation

### Monthly Costs (US Region)
- **Vercel:** $0 (hobby tier) - $20+ (pro tier)
- **Neon PostgreSQL:** $0 (hobby tier) - $50+ (pro tier)
- **Domain:** $12-15/year
- **Stripe processing:** 2.9% + $0.30 per transaction

### Sample Calculation (1000 monthly subscriptions @ $9.99 avg)
- Revenue: $9,990/month
- Stripe fees: ~$300
- Platform cost (40% split): ~$3,996
- Creator payouts (60% split): ~$5,994
- Vercel/Database: ~$50/month
- **Net profit:** ~$3,946/month

## Rollback & Updates

### Rollback to Previous Deployment
```bash
vercel rollback
```

### Update Code
```bash
git push origin main
# Vercel automatically deploys on push
```

### Update Environment Variables
1. Vercel Dashboard → Settings → Environment Variables
2. Update values
3. Redeploy current version for changes to take effect

## Security Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Database connection uses SSL
- [ ] Rate limiting implemented (future)
- [ ] CORS properly configured (future)
- [ ] Environment variables not committed to git
- [ ] API routes validate authentication tokens
- [ ] Database backups enabled
- [ ] HTTPS enforced everywhere
- [ ] No sensitive data in logs

## Troubleshooting Deployment

### Build Fails
```bash
# Check build log in Vercel
# Common issues:
# 1. TypeScript errors: npm run build locally
# 2. Missing dependencies: npm install
# 3. Environment variables: verify in Vercel dashboard
```

### Database Connection Error
```
Error: getaddrinfo ENOTFOUND
```
- Verify DATABASE_URL in Vercel
- Check database is running
- Test connection with psql locally

### Pages Show 404
- Check routes exist in `app/` directory
- Clear `.next` cache: `vercel env pull && vercel build`
- Redeploy

### API Routes Return 500
- Check runtime logs
- Verify JWT_SECRET matches
- Check database connection
- Enable debug mode

## Next Steps

1. **Add Real Stripe Integration**
   - Get live API keys from Stripe
   - Update payment processing
   - Setup webhook handling

2. **Implement Email Notifications**
   - Add email provider (SendGrid, Mailgun)
   - Create email templates
   - Add notification triggers

3. **Setup Analytics**
   - Integrate Vercel Analytics
   - Add custom event tracking
   - Create dashboard

4. **Performance Optimization**
   - Add caching layer
   - Optimize images
   - Implement pagination

5. **Production Hardening**
   - Add rate limiting
   - Implement CORS
   - Add request validation
   - Setup monitoring/alerts

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

Happy deploying! 🚀
