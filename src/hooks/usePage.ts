import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type PageRecord = Tables<"pages">;

export const usePage = (slug: string) => {
  return useQuery<PageRecord | null>({
    queryKey: ["page", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      let query = supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .limit(1);

      query = query.eq("status", "published");

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return (data as PageRecord | null) ?? null;
    },
  });
};
