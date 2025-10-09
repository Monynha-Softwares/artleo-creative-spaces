import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminTableProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const AdminTable = ({ title, description, actions, children }: AdminTableProps) => {
  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default AdminTable;
