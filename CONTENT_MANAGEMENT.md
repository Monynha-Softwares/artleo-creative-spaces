# Content Management Guide

This guide explains how to manage content for the Art Leo portfolio website. The project is now fully self-hosted—no external page builders or embedded dashboards are required.

## Access Methods

### Option 1: Supabase Dashboard (Recommended)

The easiest way to manage content is through the Supabase dashboard interface:

1. Visit the [Supabase project dashboard](https://supabase.com/dashboard) for your workspace.
2. Open **Table Editor** to browse and edit content tables.
3. Ensure your database role has access to read/write the relevant tables.

### Option 2: Future Custom Admin Panel

A custom admin panel UI is planned for easier content management. Until that ships, continue using the Supabase dashboard or SQL Editor for updates.

---

## Managing Artworks

### Add New Artwork

1. Table Editor → `artworks`
2. Click **Insert row**
3. Fill in fields:
   - **title**: Artwork name
   - **slug**: URL-friendly version (e.g., `cosmic-dreams`)
   - **description**: Detailed description (optional)
   - **category**: Type (e.g., `3D`, `Motion`, `Interactive`)
   - **year**: Year created
   - **technique**: Medium used (optional)
   - **cover_url**: Main image URL (upload to Storage first)
   - **images**: Array of additional images (JSON format: `["url1", "url2"]`)
   - **tags**: Array of searchable tags (e.g., `["abstract", "animation"]`)
   - **status**: `published` (public) or `draft` (admin-only)
   - **featured**: `true` to show on homepage
   - **display_order**: Number for manual sorting (higher = earlier)

### Upload Images

1. Storage → `artwork-images` bucket
2. Click **Upload file**
3. Select image file
4. Copy the public URL
5. Use the URL in the artwork's `cover_url` or `images` array

**Image URL format**:
```
https://<project>.supabase.co/storage/v1/object/public/artwork-images/image-name.jpg
```

### Edit Existing Artwork

1. Find the artwork in `artworks`
2. Click the row to edit
3. Update fields as needed
4. Save changes (auto-updates `updated_at`)

### Delete Artwork

1. Locate the artwork row
2. Click **Delete**
3. **Warning**: This permanently removes the artwork

---

## Managing Exhibitions

### Add Exhibition Event

1. Table Editor → `exhibitions`
2. Insert new row:
   - **title**: Exhibition name
   - **location**: Venue (optional)
   - **date**: Display date (flexible text, e.g., `March 2024`)
   - **year**: Year for sorting (required)
   - **type**: `solo` or `group`
   - **description**: Event details (optional)
   - **display_order**: Manual sort order

### Timeline Sorting

Exhibitions are sorted by:
1. `display_order` (ascending)
2. `year` (descending)

To reorder, adjust `display_order` values (0 = default auto-sort by year).

---

## Managing Pages (Home, About)

### Edit Homepage Content

1. Table Editor → `pages`
2. Find the row where `slug = 'home'`
3. Edit the `content` field (JSON format):

```json
{
  "hero": {
    "title": "Leonardo Silva",
    "subtitle": "Crafting Visual Stories",
    "description": "Exploring the intersection...",
    "tagline": "Digital Artist & Creative Developer"
  },
  "featured_disciplines": [
    {
      "title": "Motion Design",
      "description": "Dynamic visual narratives",
      "icon": "Palette"
    }
  ]
}
```

### Edit About Page

1. Locate the row where `slug = 'about'`
2. Update the `content` JSON:

```json
{
  "bio": "Your bio text here...",
  "profile_image": "https://...",
  "skills": ["3D Modeling", "Animation", "..."]
}
```

### SEO Metadata

For each page:
- **meta_title**: Browser tab title (max 60 chars)
- **meta_description**: Search result snippet (max 160 chars)

---

## Managing Settings

### View/Edit Global Settings

1. Table Editor → `settings`
2. Edit existing settings:

| Key | Value (JSON) | is_public | Description |
|-----|--------------|-----------|-------------|
| site_title | `"Art Leo"` | true | Site name |
| site_tagline | `"Digital Artist..."` | true | Tagline |
| bio | `"Artist statement..."` | true | About bio |
| social_links | `{"instagram": "..."}` | true | Social URLs |

### Add New Setting

1. Insert row with:
   - **key**: Unique identifier (lowercase_underscore)
   - **value**: JSON value (string, number, object, array)
   - **is_public**: `true` if safe for public, `false` for sensitive data
   - **description**: What this setting controls

**Security warning**: Never set `is_public = true` for API keys, secrets, or private config.

---

## Viewing Contact Messages

1. Table Editor → `contact_messages`
2. View submissions (read-only for admins)
3. Update `status` to `read` after reviewing

**Note**: Contact messages cannot be deleted (data retention policy).

---

## User Management

### Assign Admin Role

Only admins can assign roles. From the SQL Editor:

```sql
-- Find user ID from profiles table first
SELECT id, email FROM profiles WHERE email = 'user@example.com';

-- Assign admin role
INSERT INTO user_roles (user_id, role)
VALUES ('<user-id-here>', 'admin');
```

### Remove Admin Role

```sql
DELETE FROM user_roles
WHERE user_id = '<user-id>' AND role = 'admin';
```

---

## Content Workflow

1. Draft content in `draft` or `display_order = 0`
2. Preview locally via `npm run dev`
3. Promote to `published` once approved
4. Archive old entries by setting `status = 'archived'`

---

**Project note:** Art Leo is now decoupled from third-party site builders—content changes flow entirely through Supabase tables or future in-house tooling.


> Project decoupled from Lovable; no external builder dependencies.
