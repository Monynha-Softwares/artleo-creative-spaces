import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowRight, Sparkles, Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/reactbits/SplitText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { Silk } from "@/components/reactbits/Silk";
import { useReducedMotion } from "framer-motion";

const heroCards = [
  { icon: Palette, title: "Motion Design", desc: "Dynamic visual narratives" },
  { icon: Eye, title: "3D Art", desc: "Immersive spatial experiences" },
  { icon: Sparkles, title: "Interactive", desc: "Engaging digital installations" },
];

const Home = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {!prefersReducedMotion ? (
          <Silk
            className="absolute inset-0 opacity-80"
            color="#6e55ff"
            speed={4}
            noiseIntensity={1.2}
            rotation={12}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-md border border-border/50 text-fluid-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Digital Artist & Creative Developer
              </span>
            </motion.div>

            {!prefersReducedMotion ? (
              <SplitText
                text={"Leonardo Silva\nCrafting Visual Stories"}
                tag="h1"
                className="text-fluid-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-sky-400"
                textAlign="center"
                delay={60}
                duration={0.8}
                splitType="lines,chars"
                from={{ opacity: 0, y: 24 }}
                to={{ opacity: 1, y: 0 }}
              />
            ) : (
              <h1 className="text-fluid-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-sky-400">
                Leonardo Silva
                <br />
                Crafting Visual Stories
              </h1>
            )}

            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Exploring the intersection of art, technology, and emotion through immersive 3D experiences and motion design.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/portfolio">
                <Button variant="hero" size="lg" className="group">
                  Explore Portfolio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="glass" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-24 bg-gradient-to-b from-background to-card/20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-fluid-4xl font-bold mb-4">
                Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
                A curated selection of recent projects blending artistry with technology
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {heroCards.map((item, index) => (
              <SectionReveal key={item.title} delay={index * 0.1}>
                <SpotlightCard className="group relative p-8 rounded-2xl bg-card/70 border border-border/60 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10" />
                  <item.icon className="w-12 h-12 text-primary mb-4 relative z-10" />
                  <h3 className="text-fluid-xl font-bold mb-2 relative z-10">{item.title}</h3>
                  <p className="text-muted-foreground relative z-10">{item.desc}</p>
                </SpotlightCard>
              </SectionReveal>
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <div className="text-center mt-12">
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  View All Work
                  <ArrowRight className="w-5 h-5" />
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
