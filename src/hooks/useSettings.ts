import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function useSettings(): UseQueryResult<Tables<"settings">[]>;
export function useSettings(key: string): UseQueryResult<Tables<"settings"> | null>;
export function useSettings(key?: string) {
  return useQuery({
    queryKey: key ? ["settings", key] : ["settings"],
    queryFn: async () => {
      if (key) {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("key", key)
          .maybeSingle();

        if (error) throw new Error(error.message);
        return (data as Tables<"settings"> | null) ?? null;
      }

      const { data, error } = await supabase.from("settings").select("*");

      if (error) throw new Error(error.message);
      return (data as Tables<"settings">[]) ?? [];
    },
  });
}
