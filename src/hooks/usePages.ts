import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PageRecord = Database["public"]["Tables"]["pages"]["Row"];

type PagesQueryResult = PageRecord[] | PageRecord | null;

export const usePages = (slug?: string) => {
  return useQuery<PagesQueryResult>({
    queryKey: ["pages", slug],
    queryFn: async () => {
      if (!slug) {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("status", "published");

        if (error) throw error;
        return data ?? [];
      }

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
