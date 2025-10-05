import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowRight, Sparkles, Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/reactbits/SplitText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

const FEATURED_DISCIPLINES = [
  { icon: Palette, title: "Motion Design", desc: "Dynamic visual narratives" },
  { icon: Eye, title: "3D Art", desc: "Immersive spatial experiences" },
  { icon: Sparkles, title: "Interactive", desc: "Engaging digital installations" },
] as const;

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6">
        
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
                Digital Artist & Creative Developer
              </span>
            </motion.div>

            <SplitText
              as="h1"
              text={["Leonardo Silva", "Crafting Visual Stories"].join("\n")}
              className="mb-6 text-[clamp(2.25rem,8vw,3.75rem)] font-bold leading-[1.1] break-words text-balance"
            />

            <p className="mx-auto mb-8 max-w-2xl text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed text-balance">
              Exploring the intersection of art, technology, and emotion through
              immersive 3D experiences and motion design.
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURED_DISCIPLINES.map((item, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
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
              </SectionReveal>
            ))}
          </div>

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
