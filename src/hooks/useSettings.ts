import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SettingRecord = Database["public"]["Tables"]["settings"]["Row"];
type SettingValue = SettingRecord["value"];

type SettingsQueryResult = SettingRecord[] | SettingRecord | null;

export const useSettings = (key?: string) => {
  return useQuery<SettingsQueryResult>({
    queryKey: ["settings", key],
    queryFn: async () => {
      if (!key) {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("is_public", true);

        if (error) throw error;
        return data ?? [];
      }

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", key)
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useSiteSetting = <T = SettingValue | null>(key: string, fallback?: T) => {
  const { data } = useSettings(key);
  const resolvedFallback = (fallback ?? null) as T;

  if (!key) {
    return resolvedFallback;
  }

  if (!data || Array.isArray(data)) {
    return resolvedFallback;
  }

  return (data.value as T | undefined) ?? resolvedFallback;
};
