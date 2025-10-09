import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteTableRow, fetchTableRows, insertTableRow } from "@/integrations/supabase/admin";
import type { Tables } from "@/integrations/supabase/types";
import { AdminTable } from "./components/AdminTable";

interface UserWithRoles {
  profile: Tables<"profiles">;
  roles: Tables<"user_roles">[];
}

export const Users = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: () => fetchTableRows("profiles", { order: { column: "created_at", ascending: false } }),
  });

  const { data: roles, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ["admin", "user_roles"],
    queryFn: () => fetchTableRows("user_roles"),
  });

  const combined = useMemo<UserWithRoles[]>(() => {
    if (!profiles) return [];
    return profiles.map((profile) => ({
      profile,
      roles: roles?.filter((role) => role.user_id === profile.id) ?? [],
    }));
  }, [profiles, roles]);

  const toggleAdmin = useMutation({
    mutationFn: async (user: UserWithRoles) => {
      const adminRole = user.roles.find((role) => role.role === "admin");
      if (adminRole) {
        await deleteTableRow("user_roles", adminRole.id);
        return "revoked" as const;
      }
      await insertTableRow("user_roles", { user_id: user.profile.id, role: "admin" });
      return "granted" as const;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user_roles"] });
      toast({
        title: status === "granted" ? "Admin role granted" : "Admin role revoked",
        description: "Role assignment updated successfully.",
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to update role.";
      toast({ title: "Role update failed", description: message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Users & roles</h1>
        <p className="text-muted-foreground">
          Assign administrative access to trusted collaborators and review existing role assignments.
        </p>
      </div>
      <AdminTable title="Users" description="All registered users synced from Supabase auth.">
        <div className="space-y-4 p-4">
          {profilesError || rolesError ? (
            <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Unable to load users. {(profilesError ?? rolesError)?.message}
            </p>
          ) : null}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profilesLoading || rolesLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : combined.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  combined.map((user) => {
                    const isAdmin = user.roles.some((role) => role.role === "admin");
                    return (
                      <TableRow key={user.profile.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{user.profile.full_name ?? "—"}</TableCell>
                        <TableCell>{user.profile.email ?? "—"}</TableCell>
                        <TableCell className="flex flex-wrap gap-2">
                          {user.roles.length === 0 ? (
                            <Badge variant="outline">user</Badge>
                          ) : (
                            user.roles.map((role) => (
                              <Badge key={role.id} variant={role.role === "admin" ? "default" : "secondary"}>
                                {role.role}
                              </Badge>
                            ))
                          )}
                        </TableCell>
                        <TableCell className="flex justify-end">
                          <Button
                            variant={isAdmin ? "outline" : "secondary"}
                            size="sm"
                            className="gap-2"
                            disabled={toggleAdmin.isLoading}
                            onClick={() => toggleAdmin.mutate(user)}
                          >
                            {isAdmin ? (
                              <>
                                <ShieldX className="h-4 w-4" aria-hidden="true" />
                                Revoke admin
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                                Make admin
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminTable>
    </div>
  );
};

export default Users;
