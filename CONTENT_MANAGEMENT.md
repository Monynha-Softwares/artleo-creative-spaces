# Content Management Guide

This guide explains how to manage content for the Art Leo portfolio website.

## Access Methods

### Option 1: Lovable Cloud Backend (Recommended)

The easiest way to manage content is through the Lovable Cloud backend interface:

1. Click "View Backend" button in the Lovable dashboard
2. Navigate to "Table Editor" to edit content
3. All tables are accessible with proper permissions

### Option 2: Admin Panel (Future)

A custom admin panel UI is planned for easier content management. Currently use the backend dashboard.

---

## Managing Artworks

### Add New Artwork

1. Go to Backend → Table Editor → `artworks`
2. Click "Insert row"
3. Fill in fields:
   - **title**: Artwork name
   - **slug**: URL-friendly version (e.g., "cosmic-dreams")
   - **description**: Detailed description (optional)
   - **category**: Type (e.g., "3D", "Motion", "Interactive")
   - **year**: Year created
   - **technique**: Medium used (optional)
   - **cover_url**: Main image URL (upload to Storage first)
   - **images**: Array of additional images (JSON format: `["url1", "url2"]`)
   - **tags**: Array of searchable tags (e.g., `["abstract", "animation"]`)
   - **status**: `published` (public) or `draft` (admin-only)
   - **featured**: `true` to show on homepage
   - **display_order**: Number for manual sorting (higher = earlier)

### Upload Images

1. Backend → Storage → `artwork-images` bucket
2. Click "Upload file"
3. Select image file
4. Copy the public URL
5. Use URL in artwork's `cover_url` or `images` array

**Image URL Format**:
```
https://<project>.supabase.co/storage/v1/object/public/artwork-images/image-name.jpg
```

### Edit Existing Artwork

1. Find artwork in `artworks` table
2. Click row to edit
3. Update fields
4. Save changes (auto-updates `updated_at`)

### Delete Artwork

1. Find artwork in table
2. Click row → Delete
3. **Warning**: This permanently removes the artwork

---

## Managing Exhibitions

### Add Exhibition Event

1. Backend → Table Editor → `exhibitions`
2. Insert new row:
   - **title**: Exhibition name
   - **location**: Venue (optional)
   - **date**: Display date (flexible text, e.g., "March 2024")
   - **year**: Year for sorting (required)
   - **type**: "solo" or "group"
   - **description**: Event details (optional)
   - **display_order**: Manual sort order

### Timeline Sorting

Exhibitions are sorted by:
1. `display_order` (ascending)
2. `year` (descending)

To reorder: Change `display_order` values (0 = default auto-sort by year).

---

## Managing Pages (Home, About)

### Edit Homepage Content

1. Backend → Table Editor → `pages`
2. Find row where `slug = 'home'`
3. Edit `content` field (JSON format):

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

1. Find row where `slug = 'about'`
2. Update `content` JSON:

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

1. Backend → Table Editor → `settings`
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

**Security Warning**: Never set `is_public = true` for API keys, secrets, or private config.

---

## Viewing Contact Messages

1. Backend → Table Editor → `contact_messages`
2. View submissions (read-only for admins)
3. Update `status` to "read" after reviewing

**Note**: Contact messages cannot be deleted (data retention policy).

---

## User Management

### Assign Admin Role

Only admins can assign roles. From backend SQL editor:

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

### Publishing Workflow

1. Create content with `status = 'draft'`
2. Preview changes (admins can see drafts)
3. Update `status = 'published'` when ready
4. Content appears to public immediately

### Featured Content

Mark important artworks as `featured = true` to display on homepage.

---

## Best Practices

### Images

- **Format**: JPG for photos, PNG for transparency, WebP for best compression
- **Size**: Max 2MB per image
- **Dimensions**: 1920px width recommended for hero images
- **Naming**: Use descriptive names: `artwork-cosmic-dreams-2024.jpg`

### Slugs

- Lowercase letters, numbers, hyphens only
- No spaces or special characters
- Example: `"Cosmic Dreams!"` → `cosmic-dreams`

### Content Safety

- Preview changes before publishing
- Keep backups of important content (export tables)
- Test links and image URLs before saving

### SEO Tips

- Write unique meta titles and descriptions for each page
- Use descriptive alt text (planned feature)
- Keep URLs short and meaningful (slugs)

---

## Troubleshooting

### Image not loading

**Check**:
1. File uploaded to correct bucket
2. URL copied correctly
3. Bucket is public
4. No typos in URL

### Content not showing

**Check**:
1. Status is "published" (not draft)
2. Display order is set appropriately
3. No RLS policy issues (check logs)

### Can't edit content

**Check**:
1. Logged in as admin
2. User has admin role in `user_roles` table
3. RLS policies are correct

---

## Future Features

Planned admin panel will include:
- Rich text editor for descriptions
- Drag-and-drop image upload
- Visual page builder
- Bulk operations
- Content preview
- Media library

For now, use the backend dashboard for full control over all content.
