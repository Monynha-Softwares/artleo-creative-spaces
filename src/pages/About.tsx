import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const timeline = [
    { year: "2024", event: "Solo Exhibition - Digital Futures Gallery" },
    { year: "2023", event: "Group Show - Contemporary Digital Art Collective" },
    { year: "2023", event: "Artist Residency - Motion Lab Studio" },
    { year: "2022", event: "Award - Best Interactive Installation" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-16">
            <h1 className="text-fluid-4xl font-bold mb-4">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Me</span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
              Artist, creative developer, and explorer of digital realms
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Bio */}
          <SectionReveal delay={0.1}>
            <div className="space-y-6">
              <h2 className="text-fluid-3xl font-bold">Leonardo Silva</h2>
              <p className="text-fluid-base text-muted-foreground leading-relaxed">
                I'm a digital artist and creative developer based in Brazil, specializing in 
                motion design, 3D art, and interactive installations. My work explores the 
                boundaries between the physical and digital, creating immersive experiences 
                that invite viewers to question their perception of reality.
              </p>
              <p className="text-fluid-base text-muted-foreground leading-relaxed">
                With a background in computer science and fine arts, I blend technical 
                expertise with artistic vision to craft unique visual narratives. Each piece 
                is an investigation into the relationship between form, color, movement, 
                and emotion in digital space.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="https://www.instagram.com/leonardossil/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Instagram className="w-5 h-5 mr-2" />
                    Follow on Instagram
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="hero" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </SectionReveal>

          {/* Profile Image */}
          <SectionReveal delay={0.2}>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-mesh border border-border shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"
                  alt="Leonardo Silva"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            </div>
          </SectionReveal>
        </div>

        {/* Timeline */}
        <SectionReveal delay={0.3}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-fluid-3xl font-bold mb-8 text-center">
              Exhibitions & <span className="bg-gradient-primary bg-clip-text text-transparent">Timeline</span>
            </h2>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {item.year}
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-fluid-lg font-medium">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
};

export default About;
