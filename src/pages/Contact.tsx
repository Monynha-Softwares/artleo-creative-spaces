import { useState } from "react";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, Send } from "lucide-react";
import { RippleGridBackground } from "@/components/react-bits/RippleGridBackground";
import { GlassIcon } from "@/components/react-bits/GlassIcon";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission - will be connected to Lovable Cloud
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      <RippleGridBackground />
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <SectionReveal>
          <div className="text-center mb-16">
            <h1 className="text-fluid-4xl font-bold mb-4">
              Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or just want to say hello? I'd love to hear from you.
            </p>
          </div>
        </SectionReveal>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <SectionReveal delay={0.1}>
            <div className="space-y-8">
              <div>
                <h2 className="text-fluid-2xl font-bold mb-6">Let's Connect</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Whether you're interested in collaborating, commissioning work, or just want to chat about art and technology,
                  feel free to reach out through the form or my social channels.
                </p>
              </div>

              <div className="space-y-4">
                <GlassIcon
                  icon={Mail}
                  title="Email"
                  description="contact@artleo.com"
                  href="mailto:contact@artleo.com"
                />
                <GlassIcon
                  icon={Instagram}
                  title="Instagram"
                  description="@leonardossil"
                  href="https://www.instagram.com/leonardossil/"
                />
              </div>
            </div>
          </SectionReveal>

          {/* Contact Form */}
          <SectionReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or inquiry..."
                  rows={6}
                  className="bg-card border-border resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
