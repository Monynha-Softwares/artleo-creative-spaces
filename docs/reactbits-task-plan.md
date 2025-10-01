# ReactBits Integration Taskboard

This document decomposes the ReactBits adoption into actionable tasks for Codex agents. Follow the global guidelines in `AGENTS.md` and the user brief: focus on immersive 3D visuals, protect brand colors (purple `#7C3AED`, cyan `#0EA5E9`), respect dark/light themes, integrate with Supabase via `@monynha/supabase`, and provide `prefers-reduced-motion` fallbacks.

## Current State Recap
- **Routing stack**: React Router via `src/App.tsx` and `src/pages/*` (Vite project). 【F:src/App.tsx†L1-L80】
- **Hero background** still uses the bespoke `Hero3D` component. 【F:src/pages/Home.tsx†L1-L114】
- **Service cards** are static grids rendered in Home. 【F:src/pages/Home.tsx†L115-L153】
- **Portfolio/About/Contact** pages render simple cards and text without ReactBits integrations. 【F:src/pages/Portfolio.tsx†L1-L200】【F:src/pages/About.tsx†L1-L210】【F:src/pages/Contact.tsx†L1-L200】
- **No Supabase client** wired today (no `supabase` instance under `src/lib`). 【F:src/lib/utils.ts†L1-L120】

Given the mismatch between the current Vite setup and the requested "Next.js 14 + Supabase" stack, the first task below confirms the migration path before any UI work begins.

## Global Deliverable Checklist (apply to every task)
1. Update source code following Conventional Commits.
2. Ship unit tests (Vitest/React Testing Library) AND accessibility/visual regression tests (Playwright).
3. Provide dark/light mode validation and `prefers-reduced-motion` fallback proof.
4. Attach screenshots or short recordings of the rendered component.
5. Document changes in PR with a technical summary plus checklist.
6. Keep Supabase-powered sections resilient with static fallbacks when the backend is offline.

## Workstreams & Assignments

### T0 – Platform Alignment Audit
- **Owner**: Frontend Platform Agent
- **Goal**: Decide whether to migrate Vite app to Next.js 14 or adapt the brief to the current stack.
- **Steps**:
  1. Review routing (`src/App.tsx`) and build tooling to estimate migration effort. 【F:src/App.tsx†L1-L80】
  2. Propose recommendation (stay on Vite or migrate) considering timeline for ReactBits tasks.
  3. Document decision and update this taskboard if a migration is required.
- **Deliverables**: Audit notes, migration decision, follow-up tickets if Next.js migration is approved.

### T1 – ReactBits & 3D Dependencies Installation
- **Owner**: Frontend Platform Agent
- **Goal**: Install `react-bits`, `three`, `@react-three/fiber`, `@react-three/drei`, ensure pnpm lock compatibility, and add Playwright visual test script.
- **Steps**:
  1. Switch to pnpm (if not already) and install packages: `pnpm add react-bits three @react-three/fiber @react-three/drei`.
  2. Update tooling to include unit test stack (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`) if absent.
  3. Configure Playwright for visual regression; add `test:visual` script capturing component screenshots.
  4. Verify bundler compatibility (Vite or Next) with new dependencies.
  5. Commit lockfile updates.
- **Tests**: Run `pnpm test` (unit) and `pnpm test:visual` baseline capture.
- **Screenshots**: Provide Playwright snapshot samples proving script works.

### T2 – Supabase Client Foundation
- **Owner**: Supabase Agent
- **Goal**: Introduce `@monynha/supabase` client and data-fetching utilities shared by Portfolio/About/Blog (if present).
- **Steps**:
  1. Install `@monynha/supabase` and configure client (env vars, SSR compatibility if migrating to Next).
  2. Create `src/lib/supabase.ts` with typed helpers for artworks, biography, posts.
  3. Implement resilient fetch hooks using React Query with offline/static fallbacks.
  4. Update relevant providers in `App.tsx` for React Query + theme toggling.
- **Tests**: Unit tests mocking Supabase client (Vitest) and integration test verifying fallback renders without network.
- **Screenshots**: Show fallback UI screenshot when Supabase is disconnected.

### T3 – Home Hero ReactBits Refresh
- **Owner**: Frontend UI Agent
- **Goal**: Replace `Hero3D` with ReactBits `Aurora` or `Silk`, apply `SplitText`, align colors.
- **Steps**:
  1. Import chosen background component using dynamic import; implement reduced-motion fallback to existing gradient overlay.
  2. Apply brand colors (#7C3AED, #0EA5E9) via props/custom CSS.
  3. Swap hero title markup with `SplitText`, respecting heading semantics.
  4. Maintain CTA buttons and update Scroll indicator with ReactBits alternative if feasible.
  5. Ensure compatibility with theme toggle and responsive layout.
- **Tests**: Component unit tests verifying fallback triggers; Playwright visual/regression tests for hero (dark/light, reduced motion).
- **Screenshots**: Before/after hero comparisons (desktop + mobile).
- **Dependencies**: T1, T2 (for data-driven content if introduced).

### T4 – Home Service Cards with SpotlightCard
- **Owner**: Frontend UI Agent
- **Goal**: Replace static service grid with `SpotlightCard`, accessible hover effects, icon integration.
- **Steps**:
  1. Import/clone `SpotlightCard` from ReactBits; adapt to map existing services.
  2. Provide fallback styles when `prefers-reduced-motion` is enabled.
  3. Ensure icons have ARIA labels and card text meets WCAG AA contrast in both themes.
  4. Update SectionReveal wrappers if needed for animation sequencing.
- **Tests**: Unit test verifying ARIA roles/text; Playwright visual diff capturing hover states and reduced motion mode.
- **Screenshots**: Comparison of card states (default, hover, reduced motion).
- **Dependencies**: T1.

### T5 – Portfolio Page Enhancements
- **Owner**: Frontend UI Agent
- **Goal**: Integrate `PixelCard` for artwork grid and `RollingGallery` for featured works.
- **Steps**:
  1. Fetch artwork data via Supabase hooks (from T2) with static fallback dataset.
  2. Render grid using `PixelCard`, customizing gradients to match brand.
  3. Wrap featured items in `RollingGallery` with keyboard navigation.
  4. Provide smooth-scroll behavior and ensure focus outlines visible.
  5. Implement reduced-motion option (disable auto-scroll, fallback to static list).
- **Tests**: Unit tests for data rendering + fallback; Playwright accessibility test covering keyboard navigation and scroll smoothness.
- **Screenshots**: Gallery screenshot (desktop/mobile) + short capture of carousel motion.
- **Dependencies**: T1, T2.

### T6 – About Page Timeline & Biography Animations
- **Owner**: Frontend UI Agent
- **Goal**: Use `Stepper` for timeline and `TextType` for biography.
- **Steps**:
  1. Replace existing timeline markup with `Stepper`, ensuring at least three milestones.
  2. Bind timeline data from Supabase (via T2) with static fallback.
  3. Apply `TextType` to biography copy with skip animation option for reduced motion.
  4. Confirm layout works on mobile and theme variants.
- **Tests**: Unit tests verifying timeline renders data; Playwright visual/regression tests (dark/light) and reduced motion scenario.
- **Screenshots**: Capture Stepper with 3+ steps and TextType animation (GIF/video acceptable).
- **Dependencies**: T1, T2.

### T7 – Contact Page Visual Refresh
- **Owner**: Frontend UI Agent
- **Goal**: Integrate `GlassIcons` for social buttons and `RippleGrid` background.
- **Steps**:
  1. Import `GlassIcons` and map to email/Instagram/social links with accessible labels.
  2. Layer `RippleGrid` as background with low intensity; add CSS fallback for reduced motion.
  3. Validate responsive layout (mobile-first) and ensure buttons maintain focus outlines.
  4. Confirm contact form still works with Supabase (if submission present) or static fallback.
- **Tests**: Unit tests for button rendering + link targets; Playwright responsive snapshot tests (viewport 375px + 1280px) and reduced motion.
- **Screenshots**: Desktop + mobile view of contact section.
- **Dependencies**: T1, T2.

### T8 – Navigation Overhaul
- **Owner**: Frontend UI Agent
- **Goal**: Replace current navigation with `GooeyNav` (desktop) and `InfiniteMenu` (mobile), with motion fallbacks.
- **Steps**:
  1. Audit existing navigation in `src/components` (likely `Navbar` or header). Update to use ReactBits components.
  2. Ensure keyboard navigation (Tab, Enter, Space) and ARIA attributes for menus.
  3. Provide reduced-motion fallback (static nav) and ensure SSR compatibility if migrating to Next.
  4. Update routes and highlight state, leveraging React Router or Next Link depending on T0 outcome.
- **Tests**: Unit tests for navigation focus handling; Playwright accessibility run with keyboard-only navigation; screen reader smoke test script (VoiceOver/NVDA instructions).
- **Screenshots**: Desktop and mobile nav states (open/closed) showing fluid animation.
- **Dependencies**: T1 (for components), T0 decision.

### T9 – Supabase Data Integration Across Pages
- **Owner**: Supabase Agent
- **Goal**: Ensure Portfolio, About, Blog (if exists) consume Supabase data with static fallback.
- **Steps**:
  1. Update Portfolio page to read from hooks (from T2).
  2. Update About biography/timeline to load from Supabase.
  3. Audit for Blog or other dynamic sections; implement static fallback content when Supabase unreachable.
  4. Provide caching strategy (React Query) and revalidation policy.
- **Tests**: Unit tests using mocked Supabase responses; integration tests to confirm fallback UI when fetch fails.
- **Screenshots**: Capture fallback UI state for documentation.
- **Dependencies**: T2, coordinate with UI tasks (T5, T6).

### T10 – QA & Accessibility Validation
- **Owner**: QA Agent
- **Goal**: Validate all pages for unit, integration, accessibility, and visual requirements.
- **Steps**:
  1. Execute full unit test suite (`pnpm test`).
  2. Run Playwright `pnpm test:visual` for dark/light, reduced motion, responsive viewports.
  3. Perform manual accessibility audit (axe, keyboard, screen reader) focusing on new components.
  4. Compile report summarizing pass/fail with remediation items.
- **Deliverables**: QA report, logs, updated baselines if intentional changes.

### T11 – Documentation & PR Coordination
- **Owner**: Docs Agent
- **Goal**: Produce final documentation and ensure PR meets checklist.
- **Steps**:
  1. Update README or create `docs/reactbits-usage.md` summarizing component usage patterns.
  2. Collate screenshots/GIFs into `docs/media/` with captions.
  3. Draft PR body (summary, testing, checklist) referencing each task and deliverable.
  4. Verify commit history follows Conventional Commits and link all tasks.
- **Deliverables**: Documentation updates, PR draft, asset index.
- **Dependencies**: All feature tasks complete.

## Task Dependencies Summary
- T0 informs whether migration is required before implementation.
- T1 precedes all ReactBits work.
- T2 feeds Supabase data to T5/T6/T9.
- QA (T10) and Docs (T11) close after all feature work.

## Definition of Done (per task)
- Code merged with passing unit + visual tests.
- Accessibility compliance confirmed (WCAG AA, keyboard, reduced motion).
- Screenshots/GIFs stored and referenced in docs/PR.
- Supabase integration resilient with offline fallback.
- Conventional Commit messages and updated lockfiles.

