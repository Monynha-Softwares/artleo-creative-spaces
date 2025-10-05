import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExhibitions = () => {
  return useQuery({
    queryKey: ["exhibitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exhibitions")
        .select("*")
        .order("year", { ascending: false })
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};
