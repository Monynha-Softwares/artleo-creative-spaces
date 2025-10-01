import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowLeft, Calendar, Tag, Layers } from "lucide-react";

// Mock data - will be replaced with Lovable Cloud data
const artworkData: Record<string, any> = {
  "motion-study-01": {
    title: "Motion Study 01",
    year: 2024,
    category: "Motion Design",
    technique: "Digital Animation, WebGL",
    description: "An exploration of fluid motion and organic forms, created using procedural animation techniques. This piece investigates the relationship between rhythm, color, and movement in digital space.",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop",
    tags: ["Motion", "Abstract", "Experimental"],
  },
};

const ArtworkDetail = () => {
  const { slug } = useParams();
  const artwork = slug ? artworkData[slug] : null;

  if (!artwork) {
    return (
      <div className="min-h-screen overflow-x-hidden pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-[clamp(1.75rem,6vw,2.75rem)] font-bold leading-tight">Artwork Not Found</h1>
          <Link to="/portfolio">
            <Button variant="outline">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden pt-24 pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Back Button */}
        <SectionReveal>
          <Link to="/portfolio">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Button>
          </Link>
        </SectionReveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Image */}
          <SectionReveal>
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card border border-border shadow-card">
                <img
                  src={artwork.coverUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </SectionReveal>

          {/* Details */}
          <div className="space-y-8">
            <SectionReveal delay={0.1}>
              <div>
                <h1 className="mb-4 text-[clamp(1.85rem,6vw,3.25rem)] font-bold leading-tight text-balance">
                  {artwork.title}
                </h1>
                <p className="text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                    <strong className="text-foreground">Year:</strong> {artwork.year}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Tag className="w-5 h-5 text-primary" />
                  <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                    <strong className="text-foreground">Category:</strong> {artwork.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                    <strong className="text-foreground">Technique:</strong> {artwork.technique}
                  </span>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div>
                <h3 className="mb-3 text-[clamp(1.2rem,4vw,1.6rem)] font-bold leading-tight">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.4}>
              <div className="pt-4">
                <Link to="/contact">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Inquire About This Work
                  </Button>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
