import { useMemo } from "react";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, Send } from "lucide-react";
import { GlassIcon } from "@/components/reactbits/GlassIcon";
import { RippleGridBackground } from "@/components/reactbits/RippleGridBackground";
import { contactSchema, useContactForm, type ContactFormData } from "@/hooks/useContactForm";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onBlur",
  });
  const { mutateAsync: submitContact, isPending } = useContactForm();
  const { data: siteSettings } = useSiteSettings({ keys: ["contact_email", "social_instagram"] });

  const contactEmail = useMemo(() => {
    const emailSetting = siteSettings?.find((item) => item.key === "contact_email");
    if (!emailSetting) return "contact@artleo.com";

    if (typeof emailSetting.value === "string") {
      return emailSetting.value;
    }

    if (
      emailSetting.value &&
      typeof emailSetting.value === "object" &&
      "email" in emailSetting.value &&
      typeof emailSetting.value.email === "string"
    ) {
      return emailSetting.value.email;
    }

    return "contact@artleo.com";
  }, [siteSettings]);

  const instagramHandle = useMemo(() => {
    const instagramSetting = siteSettings?.find((item) => item.key === "social_instagram");
    if (!instagramSetting) return "@leonardossil";

    if (typeof instagramSetting.value === "string") {
      return instagramSetting.value;
    }

    if (
      instagramSetting.value &&
      typeof instagramSetting.value === "object" &&
      "handle" in instagramSetting.value &&
      typeof instagramSetting.value.handle === "string"
    ) {
      return instagramSetting.value.handle;
    }

    return "@leonardossil";
  }, [siteSettings]);

  const instagramUrl = useMemo(() => {
    const trimmed = instagramHandle.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    const handle = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
    return `https://www.instagram.com/${handle}`;
  }, [instagramHandle]);

  const onSubmit = async (values: ContactFormData) => {
    try {
      await submitContact(values);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      form.reset();
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error sending message",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden pt-24 pb-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <SectionReveal>
          <div className="mb-14 text-center">
            <h1 className="mb-4 text-[clamp(2rem,7vw,3.5rem)] font-bold leading-tight text-balance">
              Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,3.4vw,1.15rem)] text-muted-foreground leading-relaxed text-balance">
              Have a project in mind or just want to say hello? I'd love to hear from you.
            </p>
          </div>
        </SectionReveal>

        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border/60 bg-surface-0 p-2 sm:rounded-[2.5rem] sm:p-4 shadow-inset">
          <RippleGridBackground />
          <div className="relative z-10 rounded-[1.75rem] bg-surface-1 p-6 shadow-lg sm:rounded-[2.25rem] sm:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Contact Info */}
              <div className="col-span-1">
                <SectionReveal delay={0.1}>
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-6 text-[clamp(1.5rem,5.5vw,2.5rem)] font-bold leading-tight">Let's Connect</h2>
                      <p className="mb-6 text-[clamp(1rem,3.3vw,1.1rem)] text-muted-foreground leading-relaxed">
                        Whether you're interested in collaborating, commissioning work, or just
                        want to chat about art and technology, feel free to reach out through
                        the form or my social channels.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <GlassIcon
                        icon={<Mail className="h-6 w-6" />}
                        title="Email"
                        description={contactEmail}
                        href={`mailto:${contactEmail}`}
                      />
                      <GlassIcon
                        icon={<Instagram className="h-6 w-6" />}
                        title="Instagram"
                        description={instagramHandle}
                        href={instagramUrl}
                      />
                    </div>
                  </div>
                </SectionReveal>
              </div>

              {/* Contact Form */}
              <div className="col-span-1">
                <SectionReveal delay={0.2}>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                      noValidate
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <FormControl>
                              <Input
                                id="name"
                                placeholder="Your name"
                                autoComplete="name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <FormControl>
                              <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                autoComplete="email"
                                inputMode="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="message">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                id="message"
                                placeholder="Tell me about your project or inquiry..."
                                rows={6}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full motion-reduce:transition-none"
                        disabled={isPending}
                        aria-busy={isPending}
                      >
                        {isPending ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2" aria-hidden />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground" aria-live="polite">
                        I respect your privacy—your information will only be used to respond to this inquiry.
                      </p>
                    </form>
                  </Form>
                </SectionReveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
