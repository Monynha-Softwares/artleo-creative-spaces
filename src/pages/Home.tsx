import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowRight, Sparkles, Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/reactbits/SplitText";
import { PixelCard } from "@/components/reactbits/PixelCard";
import { usePages } from "@/hooks/usePages";
import { useSiteSetting } from "@/hooks/useSettings";
import { useArtworks } from "@/hooks/useArtworks";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ArtworkSkeleton } from "@/components/ArtworkSkeleton";

const LiquidEtherBackground = lazy(() => import("@/components/reactbits/LiquidEtherBackground"));
const SpotlightCard = lazy(() => import("@/components/reactbits/SpotlightCard"));

const HeroBackgroundFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1033] via-[#0a0d1f] to-[#06121f]">
    <div className="absolute inset-0" style={{
      backgroundImage:
        "radial-gradient(at 20% 20%, rgba(109, 76, 255, 0.25), transparent 55%)," +
        "radial-gradient(at 80% 10%, rgba(64, 134, 255, 0.18), transparent 60%)," +
        "radial-gradient(at 50% 80%, rgba(180, 90, 255, 0.12), transparent 55%)",
    }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0d1f]/60 to-[#060913]" />
  </div>
);

const FEATURED_DISCIPLINES = [
  { icon: Palette, title: "Motion Design", desc: "Dynamic visual narratives" },
  { icon: Eye, title: "3D Art", desc: "Immersive spatial experiences" },
  { icon: Sparkles, title: "Interactive", desc: "Engaging digital installations" },
] as const;

const Home = () => {
  const { data: homePage } = usePages("home");
  const tagline = useSiteSetting("site_tagline", "Digital Artist & Creative Developer");
  const { data: featuredArtworks, isLoading: artworksLoading } = useArtworks({ featured: true });
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6">
        <Suspense fallback={<HeroBackgroundFallback />}>
          <LiquidEtherBackground />
        </Suspense>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="motion-reduce:scale-100 motion-reduce:transition-none"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-6 motion-reduce:animate-none"
            >
              <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border/50 bg-surface-1/50 px-3 py-1 text-[clamp(0.85rem,3.2vw,0.95rem)] text-muted-foreground backdrop-blur-md whitespace-normal">
                <Sparkles className="h-4 w-4 text-primary" />
                {tagline}
              </span>
            </motion.div>

            <SplitText
              as="h1"
              text={["Leonardo Silva", "Crafting Visual Stories"].join("\n")}
              className="mb-6 text-[clamp(2.25rem,8vw,3.75rem)] font-bold leading-[1.1] break-words text-balance"
            />

            <p className="mx-auto mb-8 max-w-2xl text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed text-balance">
              Exploring the intersection of art, technology, and emotion through immersive 3D experiences and motion design.
            </p>

            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="group w-full">
                  Explore Portfolio
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="glass" size="lg" className="w-full">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-reduce:animate-none"
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border/50 p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-primary motion-reduce:animate-none"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Work Preview */}
      <section className="bg-gradient-to-b from-surface-0 to-surface-1/20 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="mb-4 text-[clamp(1.85rem,6vw,3.25rem)] font-bold leading-tight text-balance">
                Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="mx-auto max-w-2xl text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed text-balance">
                A curated selection of recent projects blending artistry with technology
              </p>
            </div>
          </SectionReveal>

          <ErrorBoundary>
            {artworksLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <ArtworkSkeleton key={i} />
                ))}
              </div>
            ) : featuredArtworks && featuredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {featuredArtworks.slice(0, 3).map((artwork, index) => (
                  <SectionReveal key={artwork.id} delay={index * 0.1}>
                    <Link to={`/portfolio/${artwork.slug}`}>
                      <PixelCard
                        title={artwork.title}
                        imageUrl={artwork.cover_url}
                      />
                    </Link>
                  </SectionReveal>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {FEATURED_DISCIPLINES.map((item, index) => (
                  <SectionReveal key={item.title} delay={index * 0.1}>
                    <Suspense fallback={<ArtworkSkeleton />}>
                      <SpotlightCard className="bg-surface-3/90 p-6 sm:p-8">
                        <div className="flex flex-col gap-3 text-left sm:gap-4">
                          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <item.icon className="h-7 w-7" />
                          </div>
                          <div>
                            <h3 className="mb-1 text-[clamp(1.25rem,4.5vw,1.75rem)] font-bold leading-snug text-balance">
                              {item.title}
                            </h3>
                            <p className="text-[clamp(1rem,3.2vw,1.1rem)] text-muted-foreground leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Suspense>
                  </SectionReveal>
                ))}
              </div>
            )}
          </ErrorBoundary>

          <SectionReveal delay={0.3}>
            <div className="mt-12 text-center">
              <Link to="/portfolio">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View All Work
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
