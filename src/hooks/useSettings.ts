import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";

type Setting = Tables<"settings">;

export const useSettings = (key?: string) => {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      if (!key) {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("is_public", true);

        if (error) throw error;
        return data as Setting[];
      }

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", key)
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;
      return data as Setting | null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useSiteSetting = <T = Json | null>(key: string, fallback: T) => {
  const { data } = useSettings(key);
  if (Array.isArray(data)) return fallback;
  return (data?.value as T | undefined) ?? fallback;
};
