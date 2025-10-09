import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowLeft, Calendar, Tag, Layers } from "lucide-react";
import { useArtwork } from "@/hooks/useArtwork";
import { Skeleton } from "@/components/ui/skeleton";

const ArtworkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: artwork, isLoading, error } = useArtwork(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden pt-24 pb-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen overflow-x-hidden pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-[clamp(1.75rem,6vw,2.75rem)] font-bold leading-tight">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error?.message || "The artwork you're looking for doesn't exist."}
          </p>
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

  const InquireButton = () => (
    <Link to="/contact" aria-label="Inquire about this artwork">
      <Button variant="hero" size="lg" className="w-full sm:w-auto">
        Inquire About This Work
      </Button>
    </Link>
  );

  return (
    <div className="min-h-screen overflow-x-hidden pt-24 pb-20">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-lg">
                <img
                  src={artwork.cover_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </SectionReveal>

          {/* Details */}
          <div className="flex flex-col gap-8">
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
                {artwork.year && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                      <strong className="text-foreground">Year:</strong> {artwork.year}
                    </span>
                  </div>
                )}

                {artwork.category && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Tag className="w-5 h-5 text-primary" />
                    <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                      <strong className="text-foreground">Category:</strong> {artwork.category}
                    </span>
                  </div>
                )}

                {artwork.technique && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="text-[clamp(0.95rem,3.2vw,1.1rem)]">
                      <strong className="text-foreground">Technique:</strong> {artwork.technique}
                    </span>
                  </div>
                )}
              </div>
            </SectionReveal>

            {artwork.tags && artwork.tags.length > 0 && (
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
            )}

            <SectionReveal delay={0.4} className="hidden sm:block">
              <div className="rounded-2xl border border-border/60 bg-surface-1/60 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold mb-3">Interested in this piece?</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Reach out to discuss commissions, licensing opportunities, or exhibition details.
                </p>
                <InquireButton />
              </div>
            </SectionReveal>
          </div>
        </div>

        <SectionReveal delay={0.45} className="sm:hidden mt-10">
          <div className="rounded-2xl border border-border/60 bg-surface-1/60 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold mb-3">Interested in this piece?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Reach out to discuss commissions, licensing opportunities, or exhibition details.
            </p>
            <InquireButton />
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default ArtworkDetail;
