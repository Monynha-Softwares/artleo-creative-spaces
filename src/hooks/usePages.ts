import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PageContent = Database["public"]["Tables"]["pages"]["Row"];

export const usePages = (slug?: string) => {
  return useQuery({
    queryKey: ["pages", slug],
    queryFn: async () => {
      if (!slug) {
        const { data, error } = await supabase
          .from("pages")
          .select<PageContent>("*")
          .eq("status", "published");

        if (error) throw error;
        return data ?? [];
      }

      const { data, error } = await supabase
        .from("pages")
        .select<PageContent>("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
