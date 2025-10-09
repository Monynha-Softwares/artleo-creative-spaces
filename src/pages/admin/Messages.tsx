import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Mail, Trash2, Reply } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchTableRows, updateTableRow, deleteTableRow } from "@/integrations/supabase/admin";
import type { Tables } from "@/integrations/supabase/types";
import { AdminTable } from "./components/AdminTable";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
};

type Message = Tables<"contact_messages">;

export const Messages = () => {
  const [selected, setSelected] = useState<Message | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => fetchTableRows("contact_messages", { order: { column: "created_at", ascending: false } }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTableRow("contact_messages", id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      toast({ title: "Message updated", description: "Status updated successfully." });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to update message.";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: (id: string) => deleteTableRow("contact_messages", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      toast({ title: "Message deleted", description: "The message has been removed." });
      setSelected(null);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to delete message.";
      toast({ title: "Deletion failed", description: message, variant: "destructive" });
    },
  });

  const messages = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Contact messages</h1>
        <p className="text-muted-foreground">Review new submissions, reply, and archive resolved conversations.</p>
      </div>
      <AdminTable title="Inbox" description="Messages arrive from the public contact form.">
        <div className="space-y-4 p-4">
          {error ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load messages. {error.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Loading messages...
                    </TableCell>
                  </TableRow>
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Inbox is empty.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow
                      key={message.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => setSelected(message)}
                    >
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>
                        <Badge variant={message.status === "read" ? "secondary" : "default"}>
                          {STATUS_LABELS[message.status ?? "new"] ?? message.status ?? "New"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {message.created_at
                          ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
                          : "—"}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelected(message);
                          }}
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteMessage.mutate(message.id);
                          }}
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
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed">
                  {selected.message}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="gap-2">
                    <a href={`mailto:${selected.email}`}>
                      <Reply className="h-4 w-4" aria-hidden="true" /> Reply
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    className="gap-2"
                    disabled={updateStatus.isLoading}
                    onClick={() =>
                      selected &&
                      updateStatus.mutate({
                        id: selected.id,
                        status: selected.status === "read" ? "new" : "read",
                      })
                    }
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Mark as {selected.status === "read" ? "unread" : "read"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="gap-2"
                    disabled={deleteMessage.isLoading}
                    onClick={() => selected && deleteMessage.mutate(selected.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
