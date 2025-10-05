import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface UseArtworkOptions {
  includeDrafts?: boolean;
}

type Artwork = Tables<"artworks">;

export const useArtwork = (slug: string, options: UseArtworkOptions = {}) => {
  return useQuery<Artwork | null>({
    queryKey: ["artwork", slug, options.includeDrafts ?? false],
    enabled: Boolean(slug),
    queryFn: async () => {
      let query = supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .limit(1);

      if (options.includeDrafts) {
        query = query.in("status", ["published", "draft"]);
      } else {
        query = query.eq("status", "published");
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return (data as Artwork | null) ?? null;
    },
  });
};
