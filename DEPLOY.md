# 🚀 Quick Deploy Guide

## Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy

Click the button below to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mntgxo/mn-dramas)

### Option 2: Manual Deploy via CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to project directory
cd mn-dramas

# 3. Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Option 3: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Vercel will auto-detect Vite and configure everything
5. Click "Deploy"

---

## Post-Deployment

After deployment, your app will be available at:
- **Frontend:** `https://your-app.vercel.app`
- **API:** `https://your-app.vercel.app/api`

### Test the API

```bash
# Test the API index
curl https://your-app.vercel.app/api

# Fetch latest dramas
curl https://your-app.vercel.app/api/latest

# Search for a drama
curl "https://your-app.vercel.app/api/search?q=Off%20Campus"

# Get drama details
curl https://your-app.vercel.app/api/detail?id=12979
```

---

## Environment Variables (Optional)

If you need to configure environment variables:

### Via Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings → Environment Variables**
3. Add the following (optional):

```
KISSKH_BASE_URL=https://kisskh.co
KISSKH_STREAM_KEY=your-stream-key-here
KISSKH_SUB_KEY=your-sub-key-here
VITE_API_BASE=/api
```

4. Redeploy the project

### Via CLI

```bash
# Add environment variable
vercel env add KISSKH_STREAM_KEY production

# Or import from .env.local
vercel env pull
```

---

## Troubleshooting

### Build fails with TypeScript errors

Make sure all dependencies are installed:

```bash
npm install
```

### API returns 502 errors

This usually means kisskh.co is unreachable or rate-limiting. Check:
- Your Vercel function logs: `vercel logs`
- kisskh.co is online
- You're not hitting rate limits

### Streams not loading (null stream)

kisskh.co now requires `kkey` tokens for some endpoints. Options:
1. Set `KISSKH_STREAM_KEY` env var with a valid token
2. Use Playwright to generate kkeys programmatically
3. Accept that some streams may not work (demo mode)

### CORS errors in browser

The frontend should automatically use the `/api` endpoints on Vercel. If you see CORS errors:
1. Check that `/api` functions are deployed
2. Verify `vercel.json` rewrites are correct
3. Check browser console for the actual endpoint being called

---

## Custom Domain

To use a custom domain:

1. Go to **Settings → Domains** in your Vercel project
2. Add your domain (e.g., `mndramas.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate generation (usually instant)

---

## Monitoring

### View Logs

```bash
# Production logs
vercel logs --follow

# Specific deployment
vercel logs <deployment-url>
```

### Analytics

Enable Vercel Analytics for performance insights:

```bash
npm install @vercel/analytics
```

Then add to your app:

```tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

---

## Updating Your Deployment

After making changes:

```bash
# Commit your changes
git add .
git commit -m "Update description"
git push origin main

# Vercel will auto-deploy on push to main branch
```

Or manually:

```bash
vercel --prod
```

---

## Cost

Vercel's free tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless function execution
- ✅ Automatic HTTPS
- ✅ Global CDN

For most personal/small projects, the free tier is more than enough.

---

**Need help?** Open an issue on GitHub or check the [Vercel documentation](https://vercel.com/docs).
