import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Constants } from "@/integrations/supabase/types";
import { deleteTableRow, fetchTableRows } from "@/integrations/supabase/admin";
import { AdminTable } from "./components/AdminTable";

export const Pages = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: () => fetchTableRows("pages", { order: { column: "updated_at", ascending: false } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTableRow("pages", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      toast({ title: "Page deleted", description: "The page has been removed." });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to delete page.";
      toast({ title: "Deletion failed", description: message, variant: "destructive" });
    },
  });

  const filteredPages = useMemo(() => {
    if (!data) return [];
    return data.filter((page) => {
      const matchesSearch = [page.title, page.slug, page.locale ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "all" || page.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Pages</h1>
        <p className="text-muted-foreground">Manage static pages, SEO metadata, and localized content.</p>
      </div>
      <AdminTable
        title="Pages"
        description="Update copy, publish drafts, and manage localized versions."
        actions={
          <Button asChild>
            <Link to="/admin/pages/new" className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> New page
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
              Unable to load pages. {error.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Locale</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Loading pages...
                    </TableCell>
                  </TableRow>
                ) : filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No pages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">/{page.slug}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>
                          {page.status ?? "draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.locale ?? "—"}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/pages/${page.id}`)}
                          className="gap-1"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(page.id)}
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
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

export default Pages;
