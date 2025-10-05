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

### Storybook & visual regression testing

```bash
npm run storybook
npm run chromatic
```

- `npm run storybook` bootstraps the component workbench with the new stories for Navigation, SectionReveal e skeletons.
- `npm run chromatic` envia o Storybook para o Chromatic (defina `CHROMATIC_PROJECT_TOKEN` antes de rodar para habilitar o VRT em CI).

### Playwright & axe-core

```bash
npm run test:playwright
npm run test:playwright:update
npm run test:accessibility
```

- `npm run test:playwright` executa capturas responsivas (mobile/tablet/desktop) e salva os PNGs em `reports/playwright/<breakpoint>/<rota>.png`.
- `npm run test:playwright:update` permanece disponível para equipes que prefiram rodar `playwright test --update-snapshots` (Chromatic cobre o VRT principal).
- `npm run test:accessibility` roda apenas os testes marcados com `@axe` usando axe-core.

### Lighthouse

```bash
npm run test:lighthouse
```

O script compila a build de produção, sobe `vite preview` no modo CI e gera relatórios HTML/JSON em `./reports/` usando a configuração `lighthouse.config.js`.

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
