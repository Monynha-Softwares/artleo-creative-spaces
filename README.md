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

### Automated testing & accessibility

- **Unit + interaction tests** (`vitest` + Testing Library):

  ```bash
  npm run test
  ```

- **End-to-end coverage** (Playwright + axe-core):

  ```bash
  npx playwright install chromium   # first run only
  npm run test:e2e -- --project=mobile-chromium
  npm run test:e2e -- --project=desktop-chromium
  npm run test:e2e -- --project=mobile-reduced-motion
  ```

  The mobile run asserts the focus trap, automatic closure on navigation, and validates the dialog with `axe-core` to guarantee no critical accessibility violations.

- **Lighthouse accessibility audit**:

  ```bash
  npm run build
  npm run preview -- --host 0.0.0.0 --port 4173
  CHROME_PATH=/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome \
    npx lighthouse http://127.0.0.1:4173 \
    --only-categories=accessibility \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
    --preset=desktop --throttling-method=provided \
    --screen-emulation.disabled --emulated-form-factor=none
  ```

  Headless environments without a window manager can intermittently raise `NO_FCP` warnings; rerun the command after ensuring the preview server is serving the built assets or execute the audit locally for a fully interactive report.

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
