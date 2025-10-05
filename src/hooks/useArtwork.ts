import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useArtwork = (slug: string) => {
  return useQuery({
    queryKey: ["artwork", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};
