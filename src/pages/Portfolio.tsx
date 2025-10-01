import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { RollingGallery } from "@/components/reactbits/RollingGallery";
import { PixelCard } from "@/components/reactbits/PixelCard";

// Mock data - will be replaced with Lovable Cloud data
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

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesCategory = selectedCategory === "All" || artwork.category === selectedCategory;
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = artworks.slice(0, 4);

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

        <SectionReveal delay={0.05}>
          <RollingGallery
            items={featured.map((item) => ({
              id: item.id,
              title: item.title,
              subtitle: item.category,
              imageUrl: item.coverUrl,
              href: `/art/${item.slug}`,
              footer: <span className="text-sm">{item.year}</span>,
            }))}
            speed={24}
          />
        </SectionReveal>

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
                className="h-12 rounded-full border-border bg-card pl-10"
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
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link to={`/art/${artwork.slug}`} className="block">
                <PixelCard
                  imageUrl={artwork.coverUrl}
                  title={artwork.title}
                  subtitle={artwork.category}
                  footer={<span className="text-sm">{artwork.year}</span>}
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
