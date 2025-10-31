# React Bits Integration Documentation

This document provides a comprehensive overview of how React Bits components are integrated into the Art Leo Creative Spaces portfolio site.

## Overview

React Bits is a library of animated components that offers backgrounds 3D, interactive cards, animated menus, and text effects. This project uses a curated selection of React Bits components to create an immersive and engaging user experience while maintaining excellent performance and accessibility.

## Performance Guidelines

Following React Bits best practices:
- **Maximum 2-3 components per page** to preserve performance
- **Fallback alternatives** for `prefers-reduced-motion` users
- **Mobile optimizations** to reduce animation overhead on smaller devices

## Components Catalog

### Background Components

#### 1. LiquidEtherBackground
**Location:** `src/components/reactbits/LiquidEtherBackground.tsx`

**Usage:**
- **Home Page Hero** - Main background animation

**Features:**
- WebGL-based fluid animation
- Purple/blue gradient matching brand colors
- Automatic fallback to static gradient for `prefers-reduced-motion`
- Optimized rendering with Three.js

**Props:**
```typescript
// Uses default configuration, no props needed
<LiquidEtherBackground />
```

#### 2. SilkBackground
**Location:** `src/components/reactbits/SilkBackground.tsx`

**Status:** Available but currently not active (LiquidEther is preferred)

**Features:**
- Alternative silk-like fluid animation
- Can be swapped with LiquidEther for different visual effect

#### 3. RippleGridBackground
**Location:** `src/components/reactbits/RippleGridBackground.tsx`

**Usage:**
- **Contact Page** - Background behind contact form

**Features:**
- Animated grid with ripple effects
- Subtle and non-distracting
- Complements form content

### Text Animation Components

#### 4. SplitText
**Location:** `src/components/reactbits/SplitText.tsx`

**Usage:**
- **Home Page** - Main hero title "Leonardo Silva / Crafting Visual Stories"

**Features:**
- Character-by-character text reveal
- Stagger delay for smooth animation
- Configurable tag (h1, h2, etc.)

**Props Example:**
```typescript
<SplitText
  as="h1"
  text="Leonardo Silva\nCrafting Visual Stories"
  className="mb-6 text-[clamp(2.25rem,8vw,3.75rem)] font-bold"
/>
```

#### 5. TextType
**Location:** `src/components/reactbits/TextType.tsx`

**Usage:**
- **About Page** - Biography paragraphs

**Features:**
- Typewriter effect
- Configurable delay and speed
- Multiple instances can run with different delays

**Props Example:**
```typescript
<TextType
  className="text-[clamp(1rem,3.3vw,1.1rem)] leading-relaxed"
  text="I'm a digital artist and creative developer..."
  delay={0}
/>
```

### Card Components

#### 6. SpotlightCard
**Location:** `src/components/reactbits/SpotlightCard.tsx`

**Usage:**
- **Home Page** - Featured discipline cards (Motion Design, 3D Art, Interactive)

**Features:**
- Spotlight effect following cursor
- Interactive hover states
- Customizable spotlight color

**Props Example:**
```typescript
<SpotlightCard className="bg-surface-3/90 p-6 sm:p-8">
  <div className="flex flex-col gap-3">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
      <Palette className="h-7 w-7" />
    </div>
    <h3>Motion Design</h3>
    <p>Dynamic visual narratives</p>
  </div>
</SpotlightCard>
```

#### 7. PixelCard
**Location:** `src/components/reactbits/PixelCard.tsx`

**Usage:**
- **Home Page** - Featured artworks grid
- **Portfolio Page** - All artwork items in grid

**Features:**
- Pixelated hover effect
- Image display with title/subtitle
- Optional footer content
- Mobile-friendly with `noFocus` prop

**Props Example:**
```typescript
<PixelCard
  imageUrl={artwork.cover_url}
  title={artwork.title}
  subtitle={artwork.category}
  footer={<span className="text-sm">{artwork.year}</span>}
/>
```

### Gallery Components

#### 8. RollingGallery
**Location:** `src/components/reactbits/RollingGallery.tsx`

**Usage:**
- **Portfolio Page** - Horizontal carousel for featured works (top section)

**Features:**
- Smooth horizontal scrolling
- Configurable speed
- Responsive item sizing
- Supports title, subtitle, and footer for each item

**Props Example:**
```typescript
<RollingGallery
  items={featured.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.category,
    imageUrl: item.cover_url,
    href: `/art/${item.slug}`,
    footer: <span className="text-sm">{item.year}</span>,
  }))}
  speed={24}
/>
```

### Navigation Components

#### 9. GooeyNav
**Location:** `src/components/reactbits/GooeyNav.tsx`

**Usage:**
- **Navigation Component** - Main site navigation (desktop and mobile)
- Wrapped in `src/components/Navigation.tsx`

**Features:**
- Gooey morphing effect between states
- Responsive mobile hamburger menu
- Keyboard navigation support
- Focus trap for accessibility
- Integration with FlowingMenu for mobile drawer

**Key Features:**
- Desktop: Horizontal navigation bar with animated hover states
- Mobile: Hamburger menu opening FlowingMenu drawer
- Accessibility: Full keyboard navigation, ARIA labels, focus management

#### 10. FlowingMenu
**Location:** `src/components/reactbits/FlowingMenu.tsx`

**Usage:**
- **GooeyNav Mobile Menu** - Used as the mobile drawer menu

**Features:**
- Animated marquee on hover
- Directional entrance/exit animations based on cursor position
- Active state highlighting
- GSAP-powered smooth animations
- Reduced motion support

### UI Enhancement Components

#### 11. GlassIcon
**Location:** `src/components/reactbits/GlassIcon.tsx`

**Usage:**
- **Contact Page** - Email and Instagram contact cards
- **Artwork Detail Page** - Year, Category, and Technique metadata display

**Features:**
- Glassmorphism effect
- Icon with title and description
- Optional href for links
- Hover animations

**Props Example:**
```typescript
<GlassIcon
  icon={<Mail className="h-6 w-6" />}
  title="Email"
  description="contact@artleo.com"
  href="mailto:contact@artleo.com"
/>
```

#### 12. StepperTimeline
**Location:** `src/components/reactbits/StepperTimeline.tsx`

**Usage:**
- **About Page** - Exhibitions and timeline section

**Features:**
- Vertical timeline with indicators
- Step titles, subtitles, and descriptions
- Progress line connecting steps
- Responsive layout

**Props Example:**
```typescript
<StepperTimeline
  steps={exhibitions.map((ex) => ({
    title: ex.title,
    subtitle: `${ex.year} · ${ex.location}`,
    description: ex.description,
    indicator: ex.year.toString(),
  }))}
/>
```

## Page-by-Page Breakdown

### Home Page (`src/pages/Home.tsx`)
**React Bits Components Used: 3**
1. **LiquidEtherBackground** - Hero background
2. **SplitText** - Main title animation
3. **SpotlightCard** OR **PixelCard** - Featured work/discipline cards

**Performance:** Within 2-3 component guideline (background + text + cards count as 3)

### Portfolio Page (`src/pages/Portfolio.tsx`)
**React Bits Components Used: 2**
1. **RollingGallery** - Featured works carousel
2. **PixelCard** - Grid items (counts as 1 component type even with multiple instances)

**Performance:** Within guideline, grid uses same component multiple times

### About Page (`src/pages/About.tsx`)
**React Bits Components Used: 2**
1. **TextType** - Biography text (2 instances)
2. **StepperTimeline** - Exhibitions timeline

**Performance:** Within guideline

### Contact Page (`src/pages/Contact.tsx`)
**React Bits Components Used: 2**
1. **RippleGridBackground** - Form background
2. **GlassIcon** - Contact method cards

**Performance:** Within guideline

### Artwork Detail Page (`src/pages/ArtworkDetail.tsx`)
**React Bits Components Used: 1**
1. **GlassIcon** - Metadata display (Year, Category, Technique)

**Performance:** Well within guideline, plenty of room for enhancements

### Navigation (All Pages)
**React Bits Components Used: 2**
1. **GooeyNav** - Main navigation component
2. **FlowingMenu** - Mobile menu drawer (nested in GooeyNav)

**Performance:** Shared across all pages, optimized for performance

## Accessibility Features

All React Bits components in this project include:

1. **Reduced Motion Support**
   - Check for `prefers-reduced-motion` media query
   - Provide static fallbacks
   - Example: LiquidEtherBackground shows static gradient

2. **Keyboard Navigation**
   - All interactive components support keyboard
   - Focus indicators visible
   - Tab order logical

3. **ARIA Labels**
   - Proper labeling for screen readers
   - Role attributes where appropriate
   - Semantic HTML structure

4. **Color Contrast**
   - Meets WCAG AA standards
   - Text readable against animated backgrounds
   - Focus states clearly visible

## Mobile Optimizations

1. **Touch-friendly targets** - All interactive elements minimum 44x44px
2. **Reduced animations** - Some effects disabled on mobile for performance
3. **Responsive layouts** - All components adapt to smaller screens
4. **Performance monitoring** - Animation frames optimized for 60fps

## Development Guidelines

### Adding New React Bits Components

1. **Check the 2-3 component limit per page**
2. **Add reduced motion fallback**:
   ```typescript
   const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (prefersReducedMotion) {
     return <StaticFallback />;
   }
   ```
3. **Test on mobile devices**
4. **Document in this file**

### Testing Checklist

- [ ] Works with keyboard navigation
- [ ] Respects `prefers-reduced-motion`
- [ ] Performs well on mobile (60fps)
- [ ] No console errors or warnings
- [ ] Accessible to screen readers

## Future Enhancements

Potential React Bits components to consider:

- **Aurora Background** - Alternative to LiquidEther/Silk
- **Particles Background** - For Artwork Detail pages
- **Decay Card** - Alternative card style
- **Gradient Text** - Alternative to SplitText
- **Scroll Float** - Enhanced scroll indicators

Remember to maintain the 2-3 components per page limit when adding new components.

## Resources

- React Bits Website: https://reactbits.dev/
- Component Installation: `npx shadcn@latest add https://reactbits.dev/r/[component-name]`
- Three.js Docs: https://threejs.org/docs/
- Framer Motion Docs: https://www.framer.com/motion/

## Conclusion

The React Bits integration in Art Leo provides a sophisticated, performant, and accessible user experience. The careful selection and placement of components ensures visual impact without sacrificing performance or usability.
