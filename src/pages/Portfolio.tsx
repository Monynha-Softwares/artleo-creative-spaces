import { Suspense, lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { ArtworkSkeleton } from "@/components/ArtworkSkeleton";

const RollingGallery = lazy(() =>
  import("@/components/reactbits/RollingGallery").then((module) => ({
    default: module.RollingGallery,
  })),
);

const PixelCard = lazy(() =>
  import("@/components/reactbits/PixelCard").then((module) => ({
    default: module.PixelCard,
  })),
);

const categories = ["all", "motion-design", "3d-art", "interactive", "generative"] as const;
type CategoryFilter = (typeof categories)[number];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: artworks = [], isLoading, error } = useArtworks({
    category: selectedCategory,
    search: searchQuery,
  });

  const featured = useMemo(() => artworks.slice(0, 4), [artworks]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Portfolio</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden pt-24 pb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 sm:px-6">
        {/* Header */}
        <SectionReveal>
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-[clamp(2rem,7vw,3.5rem)] font-bold leading-tight text-balance">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed text-balance">
              A collection of explorations in digital art, motion, and 3D design
            </p>
          </div>
        </SectionReveal>

        {!isLoading && featured.length > 0 && (
          <SectionReveal delay={0.05}>
            <Suspense
              fallback={
                <div className="h-[320px] w-full animate-pulse rounded-[2.5rem] bg-surface-2/50" aria-hidden />
              }
            >
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
            </Suspense>
          </SectionReveal>
        )}

        {/* Filters */}
        <SectionReveal delay={0.1}>
          <div className="mb-10 space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-full border-border bg-surface-1 shadow-sm pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all motion-reduce:transition-none"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArtworkSkeleton key={i} />
            ))}
          </div>
        ) : artworks.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/art/${artwork.slug}`} className="block">
                  <Suspense fallback={<ArtworkSkeleton />}>
                    <PixelCard
                      imageUrl={artwork.cover_url}
                      title={artwork.title}
                      subtitle={artwork.category}
                      footer={<span className="text-sm">{artwork.year}</span>}
                    />
                  </Suspense>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <SectionReveal>
            <div className="text-center py-16">
              <p className="text-fluid-lg text-muted-foreground">
                No artworks found matching your criteria.
              </p>
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
