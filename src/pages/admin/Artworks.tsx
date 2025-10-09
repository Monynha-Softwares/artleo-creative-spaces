import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Constants } from "@/integrations/supabase/types";
import { deleteTableRow, fetchTableRows } from "@/integrations/supabase/admin";
import { AdminTable } from "./components/AdminTable";

export const Artworks = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "artworks"],
    queryFn: () => fetchTableRows("artworks", { order: { column: "created_at", ascending: false } }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteTableRow("artworks", id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artworks"] });
      toast({ title: "Artwork deleted", description: "The artwork has been removed successfully." });
    },
    onError: (mutationError) => {
      const message = mutationError instanceof Error ? mutationError.message : "Unable to delete artwork.";
      toast({ title: "Deletion failed", description: message, variant: "destructive" });
    },
  });

  const filteredArtworks = useMemo(() => {
    if (!data) return [];
    return data.filter((artwork) => {
      const matchesSearch = [artwork.title, artwork.slug, artwork.category]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "all" || artwork.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Artworks</h1>
        <p className="text-muted-foreground">Create, edit, and curate artworks displayed across the portfolio.</p>
      </div>
      <AdminTable
        title="Artwork library"
        description="Manage artworks, update metadata, or archive entries."
        actions={
          <Button asChild>
            <Link to="/admin/artworks/new" className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> New artwork
            </Link>
          </Button>
        }
      >
        <div className="space-y-4 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or slug"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full min-w-[160px] md:w-auto">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Constants.public.Enums.content_status.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load artworks. {error.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Loading artworks...
                    </TableCell>
                  </TableRow>
                ) : filteredArtworks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No artworks found. Try adjusting your filters or create a new entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArtworks.map((artwork) => (
                    <TableRow key={artwork.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{artwork.title}</span>
                          <span className="text-xs text-muted-foreground">/{artwork.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{artwork.category}</TableCell>
                      <TableCell>
                        <Badge variant={artwork.status === "published" ? "default" : "secondary"}>
                          {artwork.status ?? "draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{artwork.featured ? <Badge variant="outline">Featured</Badge> : ""}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/artworks/${artwork.id}`)}
                          className="gap-1"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(artwork.id)}
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminTable>
    </div>
  );
};

export default Artworks;
