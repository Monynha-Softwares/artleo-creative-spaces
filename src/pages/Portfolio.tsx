import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useArtworks } from "@/hooks/useArtworks";
import { PixelCard } from "@/components/reactbits/PixelCard";
import { RollingGallery } from "@/components/reactbits/RollingGallery";

const Portfolio = () => {
  const { data: artworks = [], isLoading } = useArtworks();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const base = new Set<string>(["All"]);
    artworks.forEach((artwork) => base.add(artwork.category));
    return Array.from(base);
  }, [artworks]);

  const featuredArtworks = useMemo(
    () => artworks.filter((artwork) => artwork.featured).slice(0, 6),
    [artworks],
  );

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-12">
            <h1 className="text-fluid-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of explorations in digital art, motion, and 3D design
            </p>
          </div>
        </SectionReveal>

        {featuredArtworks.length > 0 && (
          <SectionReveal delay={0.05}>
            <RollingGallery
              items={featuredArtworks.map((artwork) => ({
                imageUrl: artwork.cover_url,
                title: artwork.title,
                subtitle: `${artwork.category} • ${artwork.year}`,
              }))}
              className="mb-16"
            />
          </SectionReveal>
        )}

        {/* Filters */}
        <SectionReveal delay={0.1}>
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <Link to={`/art/${artwork.slug}`} className="block">
                <PixelCard
                  imageUrl={artwork.cover_url}
                  title={artwork.title}
                  category={artwork.category}
                  meta={String(artwork.year)}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredArtworks.length === 0 && (
          <SectionReveal>
            <div className="text-center py-16">
              <p className="text-fluid-lg text-muted-foreground">
                {isLoading
                  ? "Loading artworks from Supabase..."
                  : "No artworks found matching your criteria."}
              </p>
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
