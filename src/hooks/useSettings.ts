import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Setting = Database["public"]["Tables"]["settings"]["Row"];

export const useSettings = (key?: string) => {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      if (!key) {
        const { data, error } = await supabase
          .from("settings")
          .select<Setting>("*")
          .eq("is_public", true);

        if (error) throw error;
        return data ?? [];
      }

      const { data, error } = await supabase
        .from("settings")
        .select<Setting>("*")
        .eq("key", key)
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useSiteSetting = <T>(key: string, fallback: T | null = null) => {
  const { data } = useSettings(key);
  if (!data || Array.isArray(data)) {
    return fallback;
  }

  return ((data.value as T | null) ?? fallback) as T | null;
};
