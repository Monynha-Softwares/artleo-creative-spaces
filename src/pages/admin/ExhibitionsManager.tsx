import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

interface Exhibition {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string | null;
  year: number;
  type: string;
  display_order: number;
}

const ExhibitionsManager = () => {
  const { isAdmin, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);

  const { data: exhibitions, isLoading: exhibitionsLoading } = useQuery({
    queryKey: ["admin-exhibitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exhibitions")
        .select("*")
        .order("year", { ascending: false })
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Exhibition[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exhibitions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exhibitions"] });
      toast.success("Exhibition deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete exhibition");
    },
  });

  if (isLoading || exhibitionsLoading) {
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
            <h1 className="text-4xl font-bold">Manage Exhibitions</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingExhibition(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Exhibition
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingExhibition ? "Edit" : "Add"} Exhibition</DialogTitle>
              </DialogHeader>
              <ExhibitionForm
                exhibition={editingExhibition}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setEditingExhibition(null);
                  queryClient.invalidateQueries({ queryKey: ["admin-exhibitions"] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {exhibitions?.map((exhibition) => (
            <Card key={exhibition.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{exhibition.title}</CardTitle>
                    <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
                      <span>{exhibition.year}</span>
                      {exhibition.location && <span>• {exhibition.location}</span>}
                      <span>• {exhibition.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingExhibition(exhibition);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(exhibition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

interface ExhibitionFormProps {
  exhibition: Exhibition | null;
  onSuccess: () => void;
}

const ExhibitionForm = ({ exhibition, onSuccess }: ExhibitionFormProps) => {
  const [formData, setFormData] = useState({
    title: exhibition?.title || "",
    description: exhibition?.description || "",
    location: exhibition?.location || "",
    date: exhibition?.date || "",
    year: exhibition?.year?.toString() || new Date().getFullYear().toString(),
    type: exhibition?.type || "group",
    display_order: exhibition?.display_order || 0,
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        year: parseInt(data.year),
      };

      if (exhibition) {
        const { error } = await supabase
          .from("exhibitions")
          .update(payload)
          .eq("id", exhibition.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("exhibitions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`Exhibition ${exhibition ? "updated" : "created"} successfully`);
      onSuccess();
    },
    onError: () => {
      toast.error(`Failed to ${exhibition ? "update" : "create"} exhibition`);
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="e.g., June 15-30"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., solo, group"
          />
        </div>
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

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : exhibition ? "Update" : "Create"}
      </Button>
    </form>
  );
};

export default ExhibitionsManager;
