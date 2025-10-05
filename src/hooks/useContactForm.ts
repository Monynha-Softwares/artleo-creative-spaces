import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
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

type ContactMessage = Tables<"contact_messages">;

export const useContactForm = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactMessage, Error, ContactFormData>({
    mutationFn: async (formData) => {
      const validation = contactSchema.safeParse(formData);
      if (!validation.success) {
        const issue = validation.error.issues[0];
        throw new Error(issue?.message ?? "Invalid form data");
      }

      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: validation.data.name,
            email: validation.data.email,
            message: validation.data.message,
            status: "unread",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
};
