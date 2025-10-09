import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, Pencil, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchTableRows, updateTableRow } from "@/integrations/supabase/admin";
import type { Tables } from "@/integrations/supabase/types";
import { AdminTable } from "./components/AdminTable";

export const Settings = () => {
  const [selected, setSelected] = useState<Tables<"settings"> | null>(null);
  const [valueInput, setValueInput] = useState("{}");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => fetchTableRows("settings", { order: { column: "key", ascending: true } }),
  });

  const updateSetting = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(valueInput);
      } catch (parseError) {
        const message = parseError instanceof Error ? parseError.message : "Invalid JSON";
        toast({ title: "Invalid JSON", description: message, variant: "destructive" });
        throw parseError;
      }
      return updateTableRow("settings", selected.id, { value: parsed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Setting updated", description: "Configuration saved successfully." });
      setSelected(null);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to update setting.";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Global settings</h1>
        <p className="text-muted-foreground">Adjust site-wide configuration such as hero copy, feature toggles, and theme.</p>
      </div>
      <AdminTable
        title="Configuration"
        description="Settings are stored as JSON objects. Update values carefully."
      >
        <div className="space-y-4 p-4">
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load settings. {error.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      Loading settings...
                    </TableCell>
                  </TableRow>
                ) : !data || data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No settings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((setting) => (
                    <TableRow key={setting.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{setting.key}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {setting.description ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.is_public ? "default" : "secondary"}>
                          {setting.is_public ? "Public" : "Private"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            setSelected(setting);
                            setValueInput(JSON.stringify(setting.value ?? {}, null, 2));
                          }}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
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
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" aria-hidden="true" />
                  {selected.key}
                </DialogTitle>
              </DialogHeader>
              <Textarea
                value={valueInput}
                onChange={(event) => setValueInput(event.target.value)}
                rows={12}
                className="font-mono"
                aria-label="Setting value"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateSetting.mutate()} disabled={updateSetting.isLoading} className="gap-2">
                  {updateSetting.isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Save changes
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
