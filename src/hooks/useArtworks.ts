import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseArtworksOptions {
  category?: string;
  search?: string;
  featured?: boolean;
}

export const useArtworks = (options: UseArtworksOptions = {}) => {
  return useQuery({
    queryKey: ["artworks", options],
    queryFn: async () => {
      let query = supabase
        .from("artworks")
        .select("*")
        .eq("status", "published")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options.featured) {
        query = query.eq("featured", true);
      }

      if (options.category && options.category !== "all") {
        query = query.eq("category", options.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filtering
      let filteredData = data || [];
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        filteredData = filteredData.filter(
          (artwork) =>
            artwork.title.toLowerCase().includes(searchLower) ||
            artwork.description?.toLowerCase().includes(searchLower) ||
            artwork.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      }

      return filteredData;
    },
  });
};
