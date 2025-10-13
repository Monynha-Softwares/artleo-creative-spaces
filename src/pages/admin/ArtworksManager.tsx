import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  category: string;
  technique: string | null;
  year: number | null;
  cover_url: string;
  slug: string;
  status: string;
  featured: boolean;
  display_order: number;
}

const ArtworksManager = () => {
  const { isAdmin, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ["admin-artworks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Artwork[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("artworks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-artworks"] });
      setSelectedArtworks([]);
      toast.success("Artwork deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete artwork");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("artworks").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-artworks"] });
      setSelectedArtworks([]);
      toast.success("Artworks deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete artworks");
    },
  });

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      const { error } = await supabase
        .from("artworks")
        .update({ status })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-artworks"] });
      setSelectedArtworks([]);
      toast.success("Artworks updated successfully");
    },
    onError: () => {
      toast.error("Failed to update artworks");
    },
  });

  const toggleSelection = (id: string) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((artId) => artId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedArtworks.length === artworks?.length) {
      setSelectedArtworks([]);
    } else {
      setSelectedArtworks(artworks?.map((a) => a.id) || []);
    }
  };

  if (isLoading || artworksLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-0 to-surface-1 px-4 pt-24 pb-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">Manage Artworks</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingArtwork(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Artwork
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingArtwork ? "Edit" : "Add"} Artwork</DialogTitle>
              </DialogHeader>
              <ArtworkForm
                artwork={editingArtwork}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setEditingArtwork(null);
                  queryClient.invalidateQueries({ queryKey: ["admin-artworks"] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Select All Checkbox */}
        {artworks && artworks.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={selectedArtworks.length === artworks.length}
              onCheckedChange={toggleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
              Select All
            </label>
          </div>
        )}

        <div className="grid gap-4">
          {artworks?.map((artwork) => (
            <Card key={artwork.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedArtworks.includes(artwork.id)}
                    onCheckedChange={() => toggleSelection(artwork.id)}
                    className="mt-1"
                  />
                  {artwork.cover_url && (
                    <img
                      src={artwork.cover_url}
                      alt={artwork.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {artwork.title}
                          {artwork.featured && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
                        </CardTitle>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{artwork.category}</Badge>
                          {artwork.year && <Badge variant="outline">{artwork.year}</Badge>}
                          <Badge 
                            variant={
                              artwork.status === "published" ? "default" :
                              artwork.status === "draft" ? "secondary" : "outline"
                            }
                          >
                            {artwork.status}
                          </Badge>
                          {artwork.tags?.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {artwork.description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {artwork.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingArtwork(artwork);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this artwork?")) {
                              deleteMutation.mutate(artwork.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ArtworkFormProps {
  artwork: Artwork | null;
  onSuccess: () => void;
}

const ArtworkForm = ({ artwork, onSuccess }: ArtworkFormProps) => {
  const [formData, setFormData] = useState({
    title: artwork?.title || "",
    description: artwork?.description || "",
    category: artwork?.category || "painting",
    technique: artwork?.technique || "",
    year: artwork?.year?.toString() || "",
    cover_url: artwork?.cover_url || "",
    slug: artwork?.slug || "",
    status: artwork?.status || "draft",
    featured: artwork?.featured || false,
    display_order: artwork?.display_order || 0,
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        title: data.title,
        description: data.description || null,
        category: data.category,
        technique: data.technique || null,
        year: data.year ? parseInt(data.year) : null,
        cover_url: data.cover_url,
        slug: data.slug,
        status: data.status as "draft" | "published" | "archived",
        featured: data.featured,
        display_order: data.display_order,
      };

      if (artwork) {
        const { error } = await supabase
          .from("artworks")
          .update(payload)
          .eq("id", artwork.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("artworks").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`Artwork ${artwork ? "updated" : "created"} successfully`);
      onSuccess();
    },
    onError: () => {
      toast.error(`Failed to ${artwork ? "update" : "create"} artwork`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="technique">Technique</Label>
        <Input
          id="technique"
          value={formData.technique}
          onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="cover_url">Cover Image URL</Label>
        <Input
          id="cover_url"
          value={formData.cover_url}
          onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="featured">Featured</Label>
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : artwork ? "Update" : "Create"}
      </Button>
    </form>
  );
};

export default ArtworksManager;
