import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const AdminFormSection = ({ title, description, children }: AdminFormSectionProps) => {
  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
};

export default AdminFormSection;
