import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SiteSetting = Tables<"settings">;

interface UseSiteSettingsOptions {
  keys?: string[];
}

export const useSiteSettings = (options: UseSiteSettingsOptions = {}) => {
  return useQuery<SiteSetting[]>({
    queryKey: ["site-settings", options.keys?.slice().sort().join("::") ?? "all"],
    queryFn: async () => {
      let query = supabase.from("settings").select("*");

      if (options.keys?.length) {
        query = query.in("key", options.keys);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data ?? []) as SiteSetting[];
    },
  });
};
