import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SectionReveal } from "@/components/SectionReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Instagram, Send } from "lucide-react";
import { GlassIcon } from "@/components/reactbits/GlassIcon";
import { RippleGridBackground } from "@/components/reactbits/RippleGridBackground";
import { contactSchema, type ContactFormData, useContactForm } from "@/hooks/useContactForm";

const Contact = () => {
  const { toast } = useToast();
  const contactMutation = useContactForm();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (values: ContactFormData) => {
    try {
      await contactMutation.mutateAsync(values);
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn't send your message. Please try again.";
      toast({
        title: "Error sending message",
        description: message,
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
            <h1
              id="contact-heading"
              className="mb-4 text-[clamp(2rem,7vw,3.5rem)] font-bold leading-tight text-balance"
            >
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
                        description="contact@artleo.com"
                        href="mailto:contact@artleo.com"
                      />
                      <GlassIcon
                        icon={<Instagram className="h-6 w-6" />}
                        title="Instagram"
                        description="@leonardossil"
                        href="https://www.instagram.com/leonardossil/"
                      />
                    </div>
                  </div>
                </SectionReveal>
              </div>

              {/* Contact Form */}
              <div className="col-span-1">
                <SectionReveal delay={0.2}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    noValidate
                    aria-labelledby="contact-heading"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        {...register("name")}
                      />
                      {errors.name ? (
                        <p id="name-error" className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="your.email@example.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email")}
                      />
                      {errors.email ? (
                        <p id="email-error" className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Tell me about your project or inquiry..."
                        className="resize-none"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        {...register("message")}
                      />
                      {errors.message ? (
                        <p id="message-error" className="text-sm text-destructive">
                          {errors.message.message}
                        </p>
                      ) : null}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full motion-reduce:transition-none"
                      disabled={contactMutation.isPending || isSubmitting}
                      aria-live="polite"
                    >
                      {contactMutation.isPending || isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-2" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </form>
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
