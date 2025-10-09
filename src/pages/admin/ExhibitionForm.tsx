import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminFormSection } from "./components/AdminFormSection";
import { type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";
import { fetchTableRow, insertTableRow, updateTableRow } from "@/integrations/supabase/admin";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z
    .string()
    .min(4, "Provide a year")
    .max(4, "Provide a year")
    .regex(/^[0-9]{4}$/, "Use a four-digit year"),
  date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["solo", "group"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ExhibitionForm = () => {
  const params = useParams<{ id: string }>();
  const isEditing = Boolean(params.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      year: String(new Date().getFullYear()),
      date: "",
      location: "",
      description: "",
      type: undefined,
    },
  });

  const { data: exhibition } = useQuery({
    queryKey: ["admin", "exhibitions", params.id],
    queryFn: () => fetchTableRow("exhibitions", params.id ?? ""),
    enabled: isEditing,
  });

  useEffect(() => {
    if (exhibition) {
      form.reset({
        title: exhibition.title,
        year: exhibition.year ? String(exhibition.year) : String(new Date().getFullYear()),
        date: exhibition.date ?? "",
        location: exhibition.location ?? "",
        description: exhibition.description ?? "",
        type: (exhibition.type as FormValues["type"]) ?? undefined,
      });
    }
  }, [exhibition, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: TablesInsert<"exhibitions"> | TablesUpdate<"exhibitions"> = {
        title: values.title,
        year: Number(values.year),
        date: values.date ? values.date : null,
        location: values.location ? values.location : null,
        description: values.description ? values.description : null,
        type: values.type ?? null,
      };

      if (isEditing && params.id) {
        return updateTableRow("exhibitions", params.id, payload);
      }

      return insertTableRow("exhibitions", payload as TablesInsert<"exhibitions">);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "exhibitions"] });
      toast({
        title: `Exhibition ${isEditing ? "updated" : "created"}`,
        description: "Changes saved successfully.",
      });
      navigate("/admin/exhibitions", { replace: true });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save exhibition.";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isEditing ? "Edit exhibition" : "Create exhibition"}
        </h1>
        <p className="text-muted-foreground">Provide information about the exhibition, including timing and venue.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <AdminFormSection title="Details" description="Core information that appears publicly.">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sublime Motion" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} placeholder="Describe the narrative of the exhibition." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormSection>
            </div>
            <div className="space-y-6">
              <AdminFormSection title="Metadata" description="Schedule and location details.">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input {...field} inputMode="numeric" maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2024-09-01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Lisbon, Portugal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="solo">Solo</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormSection>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isLoading} className="gap-2">
              {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isEditing ? "Save changes" : "Create exhibition"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExhibitionForm;
