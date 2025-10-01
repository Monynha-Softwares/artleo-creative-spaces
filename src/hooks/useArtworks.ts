import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type Artwork = {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: number;
  cover_url: string;
  featured?: boolean;
};

const fallbackArtworks: Artwork[] = [
  {
    id: 1,
    slug: "motion-study-01",
    title: "Motion Study 01",
    category: "Motion Design",
    year: 2024,
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    slug: "abstract-forms",
    title: "Abstract Forms",
    category: "3D Art",
    year: 2024,
    cover_url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 3,
    slug: "digital-sculpture",
    title: "Digital Sculpture",
    category: "3D Art",
    year: 2023,
    cover_url: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    slug: "fluid-dynamics",
    title: "Fluid Dynamics",
    category: "Motion Design",
    year: 2023,
    cover_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    slug: "neon-dreams",
    title: "Neon Dreams",
    category: "Interactive",
    year: 2024,
    cover_url: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 6,
    slug: "geometric-harmony",
    title: "Geometric Harmony",
    category: "3D Art",
    year: 2023,
    cover_url: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop",
  },
];

export const useArtworks = () => {
  return useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      if (!supabase) {
        return fallbackArtworks;
      }

      const { data, error } = await supabase
        .from("artworks")
        .select("id, slug, title, category, year, cover_url, featured")
        .order("year", { ascending: false });

      if (error || !data) {
        console.error("Supabase error", error);
        return fallbackArtworks;
      }

      return data.map((artwork, index) => ({
        ...artwork,
        slug: artwork.slug ?? `artwork-${artwork.id ?? index}`,
        cover_url: artwork.cover_url ?? fallbackArtworks[index % fallbackArtworks.length].cover_url,
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export type { Artwork };
