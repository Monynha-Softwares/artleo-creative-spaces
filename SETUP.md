# Setup Guide

This guide will help you set up the Art Leo portfolio website locally and in production. The project is fully self-managed—no external builder accounts are required.

## Prerequisites

- Node.js 18+ and npm
- Supabase project (database + auth already provisioned)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd artleo-creative-spaces
npm install
```

### 2. Environment Variables

Create a `.env` file at the project root with the following variables:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-project-id>
```

**Important**: Never commit the `.env` file to version control.

### 3. Database Setup

Migrations live in `supabase/migrations/` and can be applied via the Supabase CLI:

```bash
supabase db reset
```

This command recreates the local database, runs migrations, and seeds any sample data defined in `supabase/seed.sql`.

### 4. Create First Admin User

After signing up through the `/auth` page, manually assign the admin role:

1. Sign up with your email at `/auth`
2. Find your user ID from the `profiles` table
3. Run this SQL in the Supabase SQL Editor:

```sql
-- Replace 'YOUR_USER_ID' with the ID from the profiles table
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin');
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and log in with your test account.

## Configuration

### Authentication Settings

Configure auth settings via the Supabase dashboard:

1. Authentication → Settings
2. Enable the Email provider
3. Set **Site URL**: `https://yourdomain.com`
4. Add Redirect URLs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
5. Optional: Enable email confirmations for production

### Storage Buckets

Two storage buckets are pre-configured:

- `artwork-images`: Public bucket for portfolio images
- `general-media`: Public bucket for other media files

Upload images via the Supabase dashboard or the Supabase CLI. Ensure Storage policies grant public read access where needed.

## Troubleshooting

### "Requested path is invalid" error on login

Check that Site URL and Redirect URLs are configured correctly in Authentication settings.

### Can't see data after inserting

Ensure Row Level Security policies allow access for your role, or mark content as `published` for public visibility.

### Images not loading

1. Verify the bucket is public
2. Confirm image URLs follow `<SUPABASE_URL>/storage/v1/object/public/<bucket>/<path>`
3. Ensure `storage.objects` policies permit `SELECT`

### Database connection errors

Verify `.env` contains the correct credentials. Restart the dev server after env changes.

## Next Steps

- Read [DATABASE.md](./DATABASE.md) for schema details
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting instructions

---

**Project note:** Art Leo is decoupled from Lovable—local setup relies only on Supabase and standard Vite tooling.


> Project decoupled from Lovable; no external builder dependencies.
