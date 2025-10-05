import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const useContactForm = () => {
  return useMutation({
    mutationFn: async (formData: ContactFormData) => {
      // Validate data
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: validatedData.name,
            email: validatedData.email,
            message: validatedData.message,
            status: "unread",
          },
        ]);

      if (error) throw error;
    },
  });
};
