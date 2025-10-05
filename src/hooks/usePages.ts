import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function usePages(): UseQueryResult<Tables<"pages">[]>;
export function usePages(options: { slug: string }): UseQueryResult<Tables<"pages"> | null>;
export function usePages(options?: { slug?: string }) {
  const slug = options?.slug;

  return useQuery({
    queryKey: slug ? ["pages", slug] : ["pages"],
    queryFn: async () => {
      if (slug) {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (error) throw new Error(error.message);
        return (data as Tables<"pages"> | null) ?? null;
      }

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data as Tables<"pages">[]) ?? [];
    },
  });
}
