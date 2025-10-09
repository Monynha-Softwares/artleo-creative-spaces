import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteTableRow, fetchTableRows } from "@/integrations/supabase/admin";
import { AdminTable } from "./components/AdminTable";

const TYPE_LABELS: Record<string, string> = {
  solo: "Solo",
  group: "Group",
};

export const Exhibitions = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "exhibitions"],
    queryFn: () => fetchTableRows("exhibitions", { order: { column: "year", ascending: false } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTableRow("exhibitions", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exhibitions"] });
      toast({ title: "Exhibition deleted", description: "The exhibition has been removed." });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to delete exhibition.";
      toast({ title: "Deletion failed", description: message, variant: "destructive" });
    },
  });

  const filteredExhibitions = useMemo(() => {
    if (!data) return [];
    return data.filter((exhibition) => {
      return [exhibition.title, exhibition.location ?? "", exhibition.type ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [data, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Exhibitions</h1>
        <p className="text-muted-foreground">Document and archive exhibitions, including year and location.</p>
      </div>
      <AdminTable
        title="Exhibitions"
        description="Keep track of upcoming and past exhibitions."
        actions={
          <Button asChild>
            <Link to="/admin/exhibitions/new" className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> New exhibition
            </Link>
          </Button>
        }
      >
        <div className="space-y-4 p-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or location"
              className="pl-9"
            />
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load exhibitions. {error.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Loading exhibitions...
                    </TableCell>
                  </TableRow>
                ) : filteredExhibitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No exhibitions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExhibitions.map((exhibition) => (
                    <TableRow key={exhibition.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{exhibition.title}</TableCell>
                      <TableCell>{exhibition.year}</TableCell>
                      <TableCell>{exhibition.location ?? "—"}</TableCell>
                      <TableCell>
                        {exhibition.type ? (
                          <Badge variant="secondary">{TYPE_LABELS[exhibition.type] ?? exhibition.type}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/exhibitions/${exhibition.id}`)}
                          className="gap-1"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(exhibition.id)}
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

export default Exhibitions;
