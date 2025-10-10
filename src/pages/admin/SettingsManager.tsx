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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  is_public: boolean;
}

const SettingsManager = () => {
  const { isAdmin, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .order("key", { ascending: true });
      
      if (error) throw error;
      return data as Setting[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value, is_public }: { id: string; value: any; is_public: boolean }) => {
      const { error } = await supabase
        .from("settings")
        .update({ value, is_public })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting updated successfully");
    },
    onError: () => {
      toast.error("Failed to update setting");
    },
  });

  if (isLoading || settingsLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-0 to-surface-1 px-4 pt-24 pb-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your site's global settings
          </p>
        </div>

        <div className="space-y-4">
          {settings?.map((setting) => (
            <SettingCard
              key={setting.id}
              setting={setting}
              onUpdate={(value, is_public) => 
                updateMutation.mutate({ id: setting.id, value, is_public })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SettingCardProps {
  setting: Setting;
  onUpdate: (value: any, is_public: boolean) => void;
}

const SettingCard = ({ setting, onUpdate }: SettingCardProps) => {
  const [value, setValue] = useState(
    typeof setting.value === "string" ? setting.value : JSON.stringify(setting.value, null, 2)
  );
  const [isPublic, setIsPublic] = useState(setting.is_public);
  const [hasChanges, setHasChanges] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setHasChanges(true);
  };

  const handlePublicChange = (checked: boolean) => {
    setIsPublic(checked);
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      let parsedValue = value;
      // Try to parse as JSON if it looks like JSON
      if (value.trim().startsWith("{") || value.trim().startsWith("[")) {
        parsedValue = JSON.parse(value);
      }
      onUpdate(parsedValue, isPublic);
      setHasChanges(false);
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const isMultiline = typeof setting.value === "object" || 
    (typeof value === "string" && value.length > 50);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{setting.key}</CardTitle>
            {setting.description && (
              <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`public-${setting.id}`} className="text-sm">Public</Label>
            <Switch
              id={`public-${setting.id}`}
              checked={isPublic}
              onCheckedChange={handlePublicChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMultiline ? (
          <Textarea
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        )}
        
        {hasChanges && (
          <Button onClick={handleSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsManager;
