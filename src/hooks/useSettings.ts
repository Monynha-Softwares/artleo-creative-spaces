import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JsonValue } from "@/types/json";

interface Setting {
  key: string;
  value: JsonValue;
  description?: string;
}

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

export const useSiteSetting = (key: string, fallback: JsonValue | null = null) => {
  const { data } = useSettings(key);
  if (Array.isArray(data)) return fallback;
  return (data?.value ?? fallback) ?? null;
};
