import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AdminFormSection } from "./components/AdminFormSection";
import { Constants, type TablesInsert, type TablesUpdate } from "@/integrations/supabase/types";
import { fetchTableRow, insertTableRow, updateTableRow } from "@/integrations/supabase/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  technique: z.string().optional(),
  year: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{4}$/.test(value), {
      message: "Use a four-digit year",
    }),
  status: z.enum(Constants.public.Enums.content_status),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
  cover_url: z.string().url("Provide a valid image URL"),
});

type FormValues = z.infer<typeof formSchema>;

export const ArtworksForm = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = Boolean(params.id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      technique: "",
      year: "",
      status: "draft",
      featured: false,
      tags: "",
      cover_url: "",
    },
  });

  const { data: artwork } = useQuery({
    queryKey: ["admin", "artworks", params.id],
    queryFn: () => fetchTableRow("artworks", params.id ?? ""),
    enabled: isEditing,
  });

  useEffect(() => {
    if (artwork) {
      form.reset({
        title: artwork.title,
        slug: artwork.slug,
        description: artwork.description ?? "",
        category: artwork.category ?? "",
        technique: artwork.technique ?? "",
        year: artwork.year ? String(artwork.year) : "",
        status: (artwork.status as FormValues["status"]) ?? "draft",
        featured: Boolean(artwork.featured),
        tags: artwork.tags?.join(", ") ?? "",
        cover_url: artwork.cover_url ?? "",
      });
    }
  }, [artwork, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: TablesInsert<"artworks"> | TablesUpdate<"artworks"> = {
        title: values.title,
        slug: values.slug,
        description: values.description || null,
        category: values.category,
        technique: values.technique || null,
        year: values.year ? Number(values.year) : null,
        status: values.status,
        featured: values.featured,
        tags: values.tags
          ? values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : null,
        cover_url: values.cover_url,
      };

      if (isEditing && params.id) {
        return updateTableRow("artworks", params.id, payload);
      }

      return insertTableRow("artworks", payload as TablesInsert<"artworks">);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "artworks"] });
      toast({
        title: `Artwork ${isEditing ? "updated" : "created"}`,
        description: "Changes saved successfully.",
      });
      navigate("/admin/artworks", { replace: true });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to save artwork.";
      toast({ title: "Save failed", description: message, variant: "destructive" });
    },
  });

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    try {
      const filePath = `covers/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("artwork-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true, contentType: file.type });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("artwork-images").getPublicUrl(filePath);
      form.setValue("cover_url", data.publicUrl, { shouldDirty: true, shouldValidate: true });
      toast({ title: "Image uploaded", description: "Cover image updated successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed.";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {isEditing ? "Edit artwork" : "Create artwork"}
        </h1>
        <p className="text-muted-foreground">
          Provide metadata, upload a cover image, and manage the publication status of your artwork.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <AdminFormSection title="Content" description="Main information visible on the public site.">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Emergent Aurora" />
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
                        <Input {...field} placeholder="emergent-aurora" />
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
                        <Textarea
                          {...field}
                          placeholder="Describe the concept, medium, and story behind the artwork."
                          className="min-h-[160px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormSection>
              <AdminFormSection title="Metadata" description="Use these fields to categorize the artwork.">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="3D Art" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technique</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cinema4D, Octane" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="2024" inputMode="numeric" maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="futuristic, neon, immersive" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormSection>
            </div>
            <div className="space-y-6">
              <AdminFormSection title="Publishing" description="Control how and when this artwork appears on the site.">
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
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured artwork</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Highlight this artwork on the homepage hero section.
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Toggle featured" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AdminFormSection>
              <AdminFormSection
                title="Cover image"
                description="Upload to Supabase storage or provide a public image URL."
              >
                <FormField
                  control={form.control}
                  name="cover_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Upload image</label>
                  <Button asChild variant="outline" className="justify-start gap-2" disabled={isUploading}>
                    <label className="flex w-full cursor-pointer items-center gap-2">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Upload className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span>{isUploading ? "Uploading..." : "Choose file"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleUpload}
                        aria-label="Upload cover image"
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Files are stored in the <code>artwork-images</code> Supabase bucket.
                  </p>
                </div>
              </AdminFormSection>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isLoading} className="gap-2">
              {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isEditing ? "Save changes" : "Create artwork"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArtworksForm;
