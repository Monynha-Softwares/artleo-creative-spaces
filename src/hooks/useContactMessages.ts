import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ContactMessage = Tables<"contact_messages">;

interface UseContactMessagesOptions {
  enabled?: boolean;
}

export const useContactMessages = (options: UseContactMessagesOptions = {}) => {
  return useQuery<ContactMessage[]>({
    queryKey: ["contact-messages"],
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as ContactMessage[];
    },
  });
};
