# Deployment Guide

This guide covers deploying the Art Leo portfolio to production.

## Prerequisites

- Lovable Cloud account (backend already configured)
- Domain name (optional)
- Git repository

---

## Deployment Options

### Option 1: Lovable Cloud Hosting (Recommended)

The easiest deployment method using Lovable's built-in hosting:

1. **Publish Project**
   - Click "Publish" button in Lovable editor
   - Your site deploys automatically to `<project>.lovable.app`

2. **Custom Domain** (Paid plans)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as shown

3. **Environment Variables**
   - Automatically configured by Lovable Cloud
   - No manual setup needed

---

### Option 2: Vercel Deployment

Deploy to Vercel for custom configurations:

#### Initial Setup

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build` or `bun run build`
   - Output Directory: `dist`
   - Install Command: `npm install` or `bun install`

4. **Add Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables:
   
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   VITE_SUPABASE_PROJECT_ID=<your-project-id>
   ```
   
   **Important**: Get these values from your `.env` file or Lovable Cloud backend.

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Access at `<project>.vercel.app`

#### Custom Domain on Vercel

1. Settings → Domains
2. Add your domain
3. Configure DNS:
   - Type: A Record
   - Name: @ (or subdomain)
   - Value: Vercel's IP address (shown in dashboard)

---

### Option 3: Coolify Self-Hosting

For self-hosted deployments on your own server:

#### Prerequisites

- VPS with Docker installed
- Coolify instance running
- Domain pointed to server

#### Setup Steps

1. **Create New Application in Coolify**
   - Go to Coolify dashboard
   - Click "New Resource" → "Application"
   - Select "Public Repository" or connect private repo

2. **Configure Git Repository**
   - Repository URL: `https://github.com/<user>/<repo>`
   - Branch: `main`
   - Build Pack: Nixpacks (auto-detects Vite)

3. **Environment Variables**
   
   In Coolify app settings:
   
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   VITE_SUPABASE_PROJECT_ID=<your-project-id>
   ```

4. **Build Configuration**
   - Build Command: `npm run build`
   - Start Command: Not needed (static site)
   - Port: 80
   - Publish Directory: `dist`

5. **Domain Setup**
   - Add domain in Coolify
   - Configure DNS A record to point to server IP
   - Coolify auto-provisions SSL via Let's Encrypt

6. **Deploy**
   - Click "Deploy"
   - Coolify pulls code, builds, and serves

#### Auto-Deploy on Git Push

In Coolify:
1. Settings → Git
2. Enable "Automatic Deployment"
3. Webhook created automatically
4. Every push to `main` triggers rebuild

---

## Post-Deployment Checklist

### 1. Configure Authentication URLs

⚠️ **Critical**: Update Supabase Auth settings

In Lovable Cloud Backend → Authentication → Settings:

- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**:
  - `https://yourdomain.com`
  - `https://yourdomain.com/auth`
  - `http://localhost:5173` (keep for local dev)

### 2. Test Authentication

1. Visit `/auth` on production
2. Sign up with test account
3. Verify email confirmation (if enabled)
4. Test login/logout flow

### 3. Verify Content Loading

- [ ] Homepage loads featured artworks
- [ ] Portfolio page displays all artworks
- [ ] About page shows exhibitions timeline
- [ ] Contact form submits successfully
- [ ] Images load from Supabase Storage
- [ ] Navigation works across all pages

### 4. SEO Setup

- [ ] Add `sitemap.xml` (future enhancement)
- [ ] Configure `robots.txt` (already in `/public`)
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Verify meta tags on all pages
- [ ] Test Open Graph images for social sharing

### 5. Performance Optimization

- [ ] Enable compression (automatic on Vercel/Lovable)
- [ ] Check Lighthouse scores
- [ ] Verify image optimization
- [ ] Test mobile performance

---

## Continuous Deployment Workflow

### Development → Staging → Production

1. **Local Development**
   ```bash
   git checkout -b feature/new-artwork
   # Make changes
   git commit -m "Add new artwork section"
   git push origin feature/new-artwork
   ```

2. **Preview Deployment** (Vercel only)
   - Vercel creates preview URL automatically
   - Test changes at `<branch>.<project>.vercel.app`

3. **Merge to Production**
   ```bash
   git checkout main
   git merge feature/new-artwork
   git push origin main
   # Triggers automatic production deployment
   ```

---

## Monitoring & Maintenance

### Check Deployment Logs

**Lovable Cloud**:
- View logs in Lovable dashboard

**Vercel**:
- Deployments → Click deployment → View logs

**Coolify**:
- Application → Logs tab

### Rollback Deployment

**Lovable Cloud**:
- Project history → Revert to previous version

**Vercel**:
- Deployments → Previous deployment → Promote to Production

**Coolify**:
- Deployments → Select previous build → Redeploy

---

## Custom Domain SSL

All platforms auto-provision SSL certificates:

- **Lovable Cloud**: Automatic via Let's Encrypt
- **Vercel**: Automatic via Let's Encrypt  
- **Coolify**: Automatic via Let's Encrypt

**Manual renewal**: Not needed, auto-renews before expiry.

---

## Troubleshooting

### Build Fails

**Check**:
1. Node version (use 18+)
2. Dependencies install correctly
3. Environment variables set
4. Build command is correct

**Common fixes**:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Loading

**Ensure**:
1. Variables prefixed with `VITE_`
2. Restart dev server after changes
3. Vercel: Variables set for Production environment
4. Coolify: No trailing spaces in values

### Images Not Loading in Production

**Check**:
1. Supabase Storage bucket is public
2. URLs use production Supabase URL
3. CORS configured (usually automatic)
4. RLS policies allow public SELECT

### Auth Redirects to Localhost

**Fix**:
1. Update Site URL in Supabase Auth settings
2. Remove `http://localhost` from Redirect URLs (keep only for local dev)
3. Clear browser cache

---

## Scaling Considerations

### Traffic Growth

- **Lovable Cloud**: Scales automatically
- **Vercel**: Automatic scaling on all plans
- **Coolify**: Manual server upgrades needed

### Database Performance

As content grows:
1. Add indexes on frequently queried columns
2. Enable Supabase connection pooling
3. Use React Query caching effectively
4. Consider CDN for images (Supabase has built-in CDN)

### Image Optimization

Use Supabase image transformations:
```typescript
const optimizedUrl = `${url}?width=800&quality=80`
```

---

## Security

### Production Checklist

- [ ] RLS policies enabled on all tables
- [ ] Private settings have `is_public = false`
- [ ] API keys in Supabase secrets (not env vars)
- [ ] HTTPS enforced (automatic on all platforms)
- [ ] Email confirmations enabled (recommended for production)
- [ ] Rate limiting on contact form (future enhancement)

---

## Support Resources

- **Lovable Docs**: https://docs.lovable.dev
- **Vercel Docs**: https://vercel.com/docs
- **Coolify Docs**: https://coolify.io/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Backup & Recovery

### Database Backups

Lovable Cloud/Supabase:
- Daily automatic backups
- Point-in-time recovery available
- Export tables manually: Backend → Table Editor → Export

### Code Backups

- Keep Git repository up to date
- Tag releases: `git tag v1.0.0`
- Store env vars securely (password manager)

---

Your Art Leo portfolio is now deployed and ready for the world! 🎨
