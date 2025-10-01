import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { PixelCard } from "@/components/reactbits/PixelCard";
import { RollingGallery } from "@/components/reactbits/RollingGallery";

const artworks = [
  {
    id: 1,
    slug: "motion-study-01",
    title: "Motion Study 01",
    category: "Motion Design",
    year: 2024,
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "abstract-forms",
    title: "Abstract Forms",
    category: "3D Art",
    year: 2024,
    coverUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "digital-sculpture",
    title: "Digital Sculpture",
    category: "3D Art",
    year: 2023,
    coverUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "fluid-dynamics",
    title: "Fluid Dynamics",
    category: "Motion Design",
    year: 2023,
    coverUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "neon-dreams",
    title: "Neon Dreams",
    category: "Interactive",
    year: 2024,
    coverUrl: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    slug: "geometric-harmony",
    title: "Geometric Harmony",
    category: "3D Art",
    year: 2023,
    coverUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop",
  },
];

const categories = ["All", "Motion Design", "3D Art", "Interactive"];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
      const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const highlightImages = useMemo(() => artworks.slice(0, 5).map((art) => art.coverUrl), []);

  return (
    <div className="min-h-screen pt-24 pb-16 space-y-16">
      <div className="container mx-auto px-4 space-y-16">
        <SectionReveal>
          <div className="text-center mb-8">
            <h1 className="text-fluid-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of explorations in digital art, motion, and 3D design
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="rounded-3xl bg-card/60 border border-border/60 overflow-hidden">
            <div className="px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search artworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-border"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
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
            {!prefersReducedMotion && (
              <div className="border-t border-border/60">
                <RollingGallery images={highlightImages} autoplay pauseOnHover />
              </div>
            )}
          </div>
        </SectionReveal>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/art/${artwork.slug}`} className="block">
                <PixelCard
                  variant="pink"
                  className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur"
                  colors="#c084fc,#8b5cf6,#22d3ee"
                  gap={6}
                  speed={30}
                  noFocus={prefersReducedMotion}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                    <img
                      src={artwork.coverUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30 mb-2">
                      {artwork.category}
                    </span>
                    <h3 className="text-fluid-xl font-bold text-foreground mb-1">{artwork.title}</h3>
                    <p className="text-sm text-muted-foreground">{artwork.year}</p>
                  </div>
                </PixelCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredArtworks.length === 0 && (
          <SectionReveal>
            <div className="text-center py-16">
              <p className="text-fluid-lg text-muted-foreground">No artworks found matching your criteria.</p>
            </div>
          </SectionReveal>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
