# Setup Guide

This guide will help you set up the Art Leo portfolio website locally and in production.

## Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) 10 (enable with `corepack use pnpm@10.5.2`)
- bun (optional)
- A Lovable Cloud account (Supabase backend is already configured)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd artleo-creative-spaces-main
pnpm install
# or, if you prefer bun
bun install
```

> **Note:** Running scripts with plain npm in environments that export `npm_config_http_proxy` emits deprecation warnings. pnpm avoids those messages by default.

### 2. Environment Variables

The `.env` file is automatically configured by Lovable Cloud. It contains:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

**Important**: Never commit the `.env` file to version control.

### 3. Database Setup

The database schema is already set up via migrations in `supabase/migrations/`. To verify or reset:

1. All migrations are automatically applied by Lovable Cloud
2. Check migration status in the backend dashboard

### 4. Create First Admin User

After signing up through the `/auth` page, you need to manually assign admin role:

1. Sign up with your email at `/auth`
2. Find your user ID from the profiles table
3. Run this SQL in the backend dashboard:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID from profiles table
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

### 5. Seed Initial Data

The database was seeded during migration with sample content. To add more:

1. Use the backend dashboard to insert data directly
2. Or create custom seed scripts in `supabase/seed.sql`

### 6. Start Development Server

```bash
pnpm run dev
# or
bun dev
```

Visit `http://localhost:5173`

## Configuration

### Authentication Settings

Configure auth settings via Lovable Cloud backend:

1. Go to Authentication → Settings
2. Enable Email provider
3. Configure Site URL: `https://yourdomain.com`
4. Add Redirect URLs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. For testing: Disable email confirmation (auto-confirm)

### Storage Buckets

Two storage buckets are pre-configured:

- `artwork-images`: Public bucket for portfolio images
- `general-media`: Public bucket for other media files

Upload images via:
- Backend dashboard (Storage section)
- Future admin panel

## Troubleshooting

### "Requested path is invalid" error on login

**Solution**: Check that Site URL and Redirect URLs are configured correctly in Authentication settings.

### Can't see data after inserting

**Solution**: Check RLS policies. Ensure you're logged in as admin to view protected content, or that content is marked as `published` for public access.

### Images not loading

**Solution**: 
1. Verify bucket is public
2. Check image URLs use correct format: `<SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>`
3. Ensure RLS policies on storage.objects allow SELECT

### Database connection errors

**Solution**: Verify `.env` file has correct credentials. Restart dev server after env changes.

## Next Steps

- Read [DATABASE.md](./DATABASE.md) for schema details
- See [CONTENT_MANAGEMENT.md](./CONTENT_MANAGEMENT.md) for content editing
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Support

For issues:
1. Check console logs for errors
2. Review RLS policies in backend dashboard
3. Verify environment variables
4. Check Lovable Cloud documentation
