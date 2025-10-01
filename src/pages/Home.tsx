import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/SectionReveal";
import { ArrowRight, Sparkles, Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SilkBackground } from "@/components/reactbits/SilkBackground";
import { SplitText } from "@/components/reactbits/SplitText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden py-24 sm:py-32">
        <SilkBackground />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6 sm:gap-8 sm:items-start sm:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-md border border-border/50 text-fluid-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Digital Artist & Creative Developer
              </span>
            </motion.div>

            <div className="w-full">
              <SplitText
                as="h1"
                text={["Leonardo Silva", "Crafting Visual Stories"].join("\n")}
                className="hidden sm:inline-flex text-fluid-5xl font-bold leading-[1.05] tracking-tight"
              />

              <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-tight sm:hidden">
                <span className="block">Leonardo Silva</span>
                <span className="block text-primary/90">Crafting Visual Stories</span>
              </h1>
            </div>

            <p className="text-base sm:text-fluid-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto sm:mx-0 mb-6 sm:mb-8 leading-relaxed">
              Exploring the intersection of art, technology, and emotion through
              immersive 3D experiences and motion design.
            </p>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-4">
              <Link to="/portfolio" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                  Explore Portfolio
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
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

      {/* Featured Work Preview */}
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
            {[
              { icon: Palette, title: "Motion Design", desc: "Dynamic visual narratives" },
              { icon: Eye, title: "3D Art", desc: "Immersive spatial experiences" },
              { icon: Sparkles, title: "Interactive", desc: "Engaging digital installations" },
            ].map((item, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <SpotlightCard>
                  <div className="flex flex-col gap-4 text-left">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-fluid-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
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
