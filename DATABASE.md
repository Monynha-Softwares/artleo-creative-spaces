# Database Schema Documentation

This document describes the database structure for the Art Leo portfolio website.

## Overview

The database uses PostgreSQL (via Lovable Cloud/Supabase) with Row Level Security (RLS) enabled on all tables.

## Tables

### `artworks`

Portfolio pieces displayed in the gallery.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | text | No | - | Artwork title |
| slug | text | No | - | URL-friendly identifier |
| description | text | Yes | - | Detailed description |
| category | text | No | - | Category (e.g., "3D", "Motion") |
| year | integer | Yes | - | Year created |
| technique | text | Yes | - | Artistic technique used |
| cover_url | text | No | - | Main image URL |
| images | jsonb | Yes | `[]` | Array of additional image URLs |
| tags | text[] | Yes | `[]` | Searchable tags |
| status | content_status | Yes | `published` | Published or draft |
| featured | boolean | Yes | false | Show on homepage |
| display_order | integer | Yes | 0 | Sort order |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Last update timestamp |

**RLS Policies**:
- Public can SELECT where `status = 'published'` OR user is admin
- Only admins can INSERT, UPDATE, DELETE

**Indexes**:
- Primary key on `id`
- Unique on `slug`

---

### `exhibitions`

Timeline events for the About page.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | text | No | - | Exhibition title |
| location | text | Yes | - | Venue location |
| date | text | Yes | - | Display date (flexible format) |
| year | integer | No | - | Year for sorting |
| type | text | Yes | `group` | "solo" or "group" |
| description | text | Yes | - | Event description |
| display_order | integer | Yes | 0 | Manual sort order |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Last update timestamp |

**RLS Policies**:
- Public can SELECT all
- Only admins can INSERT, UPDATE, DELETE

---

### `pages`

CMS pages (home, about, etc.).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| slug | text | No | - | Page identifier (e.g., "home") |
| title | text | No | - | Page title |
| content | jsonb | No | - | Flexible content structure |
| meta_title | text | Yes | - | SEO title |
| meta_description | text | Yes | - | SEO description |
| locale | text | Yes | `en` | Language code |
| status | content_status | Yes | `published` | Published or draft |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Last update timestamp |

**RLS Policies**:
- Public can SELECT where `status = 'published'` OR user is admin
- Only admins can INSERT, UPDATE, DELETE

**Indexes**:
- Unique on `slug`

---

### `settings`

Global site configuration.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| key | text | No | - | Setting identifier |
| value | jsonb | No | - | Setting value (any type) |
| description | text | Yes | - | Human-readable description |
| is_public | boolean | Yes | false | **SECURITY**: Public visibility |
| updated_at | timestamptz | Yes | now() | Last update timestamp |

**RLS Policies**:
- Public can SELECT where `is_public = true`
- Admins can SELECT all
- Only admins can INSERT, UPDATE, DELETE

**Security Note**: Sensitive settings (API keys, private config) must have `is_public = false`.

**Indexes**:
- Unique on `key`

---

### `contact_messages`

Form submissions from the Contact page.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| name | text | No | - | Sender name |
| email | text | No | - | Sender email |
| message | text | No | - | Message content |
| status | text | Yes | `unread` | "unread" or "read" |
| created_at | timestamptz | Yes | now() | Submission timestamp |

**RLS Policies**:
- Public can INSERT (anonymous submissions)
- Only admins can SELECT, UPDATE
- No DELETE allowed (preserve records)

**Security**: Email addresses are protected from public view.

---

### `profiles`

Extended user information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | - | Foreign key to auth.users |
| email | text | Yes | - | User email (copied from auth) |
| full_name | text | Yes | - | Display name |
| avatar_url | text | Yes | - | Profile picture URL |
| created_at | timestamptz | Yes | now() | Profile creation |
| updated_at | timestamptz | Yes | now() | Last update |

**RLS Policies**:
- Users can SELECT own profile
- Admins can SELECT all profiles
- Users can UPDATE own profile
- Users can INSERT own profile (via trigger)

**Trigger**: `handle_new_user()` automatically creates profile when user signs up.

---

### `user_roles`

Role-based access control.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Foreign key to auth.users |
| role | app_role | No | - | Enum: admin, editor, user |

**RLS Policies**:
- Users can SELECT own role
- Admins can SELECT all roles
- Only admins can INSERT, UPDATE, DELETE

**Security**: Prevents privilege escalation. Roles can only be assigned via admin SQL access.

---

## Enums

### `content_status`

```sql
'published' | 'draft'
```

### `app_role`

```sql
'admin' | 'editor' | 'user'
```

---

## Functions

### `has_role(_user_id uuid, _role app_role) RETURNS boolean`

Security definer function to check user roles without triggering recursive RLS.

```sql
SELECT has_role(auth.uid(), 'admin'); -- true if user is admin
```

### `handle_updated_at() RETURNS trigger`

Automatically updates `updated_at` timestamp on row modification.

### `handle_new_user() RETURNS trigger`

Creates profile entry when new user signs up via auth.

---

## Storage Buckets

### `artwork-images`

- **Public**: Yes
- **Purpose**: Portfolio cover images and galleries
- **RLS**: Public SELECT, admin-only INSERT/UPDATE/DELETE

### `general-media`

- **Public**: Yes  
- **Purpose**: Other site assets (icons, backgrounds, etc.)
- **RLS**: Public SELECT, admin-only INSERT/UPDATE/DELETE

---

## Security Summary

✅ **All tables have RLS enabled**  
✅ **Email addresses protected** (profiles table secured)  
✅ **Contact messages admin-only**  
✅ **Settings separated by public/private flag**  
✅ **Role-based access control** via dedicated table  
✅ **Security definer functions** prevent RLS recursion  

---

## Migrations

All schema changes are tracked in `supabase/migrations/`. Never modify production schema directly.

To create a new migration:

1. Use Lovable Cloud migration tool
2. Test locally first
3. Apply to production via backend dashboard

---

## Entity Relationship Diagram

```
auth.users (Supabase managed)
    ↓ (1:1)
profiles (id FK to auth.users)
    ↓ (1:many)
user_roles (user_id FK to auth.users)

artworks (standalone)
exhibitions (standalone)
pages (standalone)
settings (standalone)
contact_messages (standalone)
```

---

## Indexes & Performance

Current indexes:
- All primary keys (automatic)
- Unique constraints on slugs (artworks, pages)
- Unique on settings.key

**Future optimization opportunities**:
- Full-text search on artworks.description
- GIN index on artworks.tags for array searches
- Index on exhibitions.year for timeline sorting
