# Art Leo · Creative Spaces

Art Leo is a Vite + React portfolio that pairs cinematic motion design with interactive UI patterns. The project showcases background shaders, animated typography, and Supabase-ready data flows that can be extended to power a full digital art showcase.

## Features

- ✨ Immersive hero with animated silk background and split text reveal
- 🧭 Responsive gooey navigation with Flowing Menu hand-off on mobile (Infinite Menu has been removed)
- 🖼️ Animated portfolio gallery with search, filtering, and rolling highlight carousel
- 🧱 Stepper-based timeline and typewriter biography for the About page
- 📬 Contact form with toast feedback and safety guards against state updates after unmount
- ♿ Motion-reduced fallbacks across custom React Bits components

## Tech stack

- [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/) with custom fluid token scales
- [shadcn/ui](https://ui.shadcn.com/) component primitives
- Animation libraries: [Framer Motion](https://www.framer.com/motion/) and [GSAP](https://gsap.com/)
- React Bits-inspired bespoke components (`SilkBackground`, `FlowingMenu`, `SpotlightCard`, etc.)

## Getting started

### Prerequisites

- Node.js 18.18 or newer (Node 20 LTS recommended)
- npm 9+ (bundled with recent Node.js releases)

### Installation

```bash
npm install
```

### Local development

```bash
npm run dev
```

The app boots on `http://localhost:5173` by default. Hot Module Reloading (HMR) is enabled out of the box.

### Supabase configuration

The admin panel and dynamic content rely on Supabase. Configure the environment variables before starting the dev server:

```bash
cp .env.example .env.local
```

Populate the following keys (available in the Supabase dashboard):

```bash
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

To run Supabase locally, install the CLI and start the stack:

```bash
npx supabase start
```

Apply migrations if you add new database objects:

```bash
npx supabase db push
```

Seed an admin user once per environment. Create a user via the Supabase Auth dashboard (or CLI) and insert an admin role:

```sql
insert into user_roles (user_id, role)
values ('<user-uuid>', 'admin')
on conflict (user_id, role) do nothing;
```

You can add additional collaborators by repeating the insertion with the target user ID.

### Production build

```bash
npm run build
npm run preview
```

- `npm run build` compiles the project for production.
- `npm run preview` serves the production build locally for smoke testing.

### Quality checks

```bash
npm run lint
```

Linting ensures TypeScript, React, and accessibility conventions stay consistent.

Run unit tests with:

```bash
npm test
```

### Admin panel

- Visit `http://localhost:5173/admin` while authenticated with an admin role.
- The panel includes sections for artworks, pages, exhibitions, contact messages, settings, and user role management.
- Lists and forms use React Query for caching; mutations automatically refresh the relevant tables.
- Image uploads for artworks are stored in the `artwork-images` Supabase storage bucket.
- Non-admin visitors are redirected to `/auth`.

## Project structure

```
├── public/                # Static assets served as-is
├── src/
│   ├── components/
│   │   ├── reactbits/     # Custom animated UI primitives (FlowingMenu, SilkBackground, ...)
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Hero3D.tsx     # Legacy hero Three.js field (currently unused but kept for reference)
│   │   └── SectionReveal.tsx
│   ├── hooks/             # Shared hooks (toast, etc.)
│   ├── integrations/      # Supabase and API adapters
│   ├── pages/             # Route components (Home, Portfolio, About, Contact, ...)
│   ├── lib/               # Utility helpers
│   ├── App.tsx            # Router + providers
│   └── main.tsx           # Vite entry point
├── supabase/              # Database configuration & migrations (optional)
├── tailwind.config.ts
└── vite.config.ts
```

## Key implementation notes

- **Navigation:** The Infinite Menu experiment has been removed. Mobile navigation now uses `FlowingMenu`, providing consistent hover/touch behaviour with reduced-motion awareness.
- **Motion safeguards:** All animated components check `prefers-reduced-motion`, fall back gracefully, and avoid excessive GPU load.
- **State safety:** The contact form clears pending timeouts during unmount to prevent memory leaks when navigating away mid-submit.
- **Typed data models:** Portfolio listings declare explicit TypeScript types, improving maintainability as the data source evolves.

## Extending the project

- Replace the mock data in `src/pages/Portfolio.tsx` with Supabase queries located in `src/integrations`.
- Update the imagery and copywriting in `src/pages/Home.tsx`, `About.tsx`, and `Contact.tsx` to match your brand voice.
- Explore additional React Bits-inspired components inside `src/components/reactbits/` to enrich future sections.

## License

This project inherits the licensing of the upstream template. Review the repository history or organizational standards to determine the appropriate license before publishing.
