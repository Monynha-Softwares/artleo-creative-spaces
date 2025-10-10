import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface PageContent {
  title: string;
  content: Json;
  meta_title?: string;
  meta_description?: string;
}

type PagesQueryResult = PageContent[] | (PageContent | null);

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
        return data as PageContent[];
      }

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data as PageContent | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
