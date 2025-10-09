import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
}

export const usePages = (slug?: string) => {
  return useQuery({
    queryKey: ["pages", slug],
    queryFn: async () => {
      if (!slug) {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("status", "published");

        if (error) throw error;
        return data;
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
