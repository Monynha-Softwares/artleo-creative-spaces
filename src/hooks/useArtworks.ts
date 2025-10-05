import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface UseArtworksOptions {
  category?: string;
  search?: string;
  featured?: boolean;
  includeDrafts?: boolean;
}

type Artwork = Tables<"artworks">;

export const useArtworks = (options: UseArtworksOptions = {}) => {
  const queryKey = [
    "artworks",
    {
      category: options.category ?? null,
      search: options.search?.trim().toLowerCase() ?? null,
      featured: Boolean(options.featured),
      includeDrafts: Boolean(options.includeDrafts),
    },
  ] as const;

  return useQuery<Artwork[]>({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from("artworks")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options.includeDrafts) {
        query = query.in("status", ["published", "draft"]);
      } else {
        query = query.eq("status", "published");
      }

      if (options.featured) {
        query = query.eq("featured", true);
      }

      if (options.category && options.category !== "all") {
        query = query.eq("category", options.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      const artworks = (data ?? []) as Artwork[];

      if (!options.search) {
        return artworks;
      }

      const searchLower = options.search.toLowerCase();
      return artworks.filter((artwork) => {
        const matchesTitle = artwork.title.toLowerCase().includes(searchLower);
        const matchesDescription = artwork.description?.toLowerCase().includes(searchLower);
        const matchesTags = artwork.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

        return matchesTitle || matchesDescription || matchesTags;
      });
    },
  });
};
