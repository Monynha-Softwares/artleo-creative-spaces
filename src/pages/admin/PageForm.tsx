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
import { Constants, type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";
import { fetchTableRow, insertTableRow, updateTableRow } from "@/integrations/supabase/admin";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  status: z.enum(Constants.public.Enums.content_status),
  locale: z.string().optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .superRefine((value, ctx) => {
      try {
        JSON.parse(value);
      } catch (error) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Content must be valid JSON" });
      }
    }),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const PageForm = () => {
  const params = useParams<{ id: string }>();
  const isEditing = Boolean(params.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
      locale: "",
      content: "{}",
      meta_title: "",
      meta_description: "",
    },
  });

  const { data: page } = useQuery({
    queryKey: ["admin", "pages", params.id],
    queryFn: () => fetchTableRow("pages", params.id ?? ""),
    enabled: isEditing,
  });

  useEffect(() => {
    if (page) {
      form.reset({
        title: page.title,
        slug: page.slug,
        status: (page.status as FormValues["status"]) ?? "draft",
        locale: page.locale ?? "",
        content: JSON.stringify(page.content ?? {}, null, 2),
        meta_title: page.meta_title ?? "",
        meta_description: page.meta_description ?? "",
      });
    }
  }, [form, page]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: TablesInsert<"pages"> | TablesUpdate<"pages"> = {
        title: values.title,
        slug: values.slug,
        status: values.status,
        locale: values.locale ? values.locale : null,
        content: JSON.parse(values.content),
        meta_title: values.meta_title ? values.meta_title : null,
        meta_description: values.meta_description ? values.meta_description : null,
      };

      if (isEditing && params.id) {
        return updateTableRow("pages", params.id, payload);
      }

      return insertTableRow("pages", payload as TablesInsert<"pages">);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      toast({
        title: `Page ${isEditing ? "updated" : "created"}`,
        description: "Changes saved successfully.",
      });
      navigate("/admin/pages", { replace: true });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save page.";
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
          {isEditing ? "Edit page" : "Create page"}
        </h1>
        <p className="text-muted-foreground">
          Structure page content as JSON blocks and manage localized metadata.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <AdminFormSection title="Content" description="Define the page title and JSON body.">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="About Art Leo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="about" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content JSON</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="font-mono" rows={14} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormSection>
            </div>
            <div className="space-y-6">
              <AdminFormSection title="Metadata" description="SEO and localization options.">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Constants.public.Enums.content_status.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locale</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="en" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Art Leo — About" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
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
              {isEditing ? "Save changes" : "Create page"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PageForm;
