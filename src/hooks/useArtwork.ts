import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useArtwork = (slug: string, options?: { includeDrafts?: boolean }) => {
  const includeDrafts = options?.includeDrafts ?? false;

  return useQuery({
    queryKey: ["artwork", slug, includeDrafts],
    queryFn: async () => {
      let query = supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .limit(1);

      if (!includeDrafts) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!slug,
  });
};
