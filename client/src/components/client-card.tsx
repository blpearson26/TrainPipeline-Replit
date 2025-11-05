import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MoreVertical } from "lucide-react";
import { StatusBadge } from "./status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientCardProps {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry?: string;
  status: "active" | "pending";
  onView?: () => void;
  onEdit?: () => void;
}

export function ClientCard({
  companyName,
  contactName,
  email,
  phone,
  industry,
  status,
  onView,
  onEdit,
}: ClientCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-client-${companyName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid="text-client-name">{companyName}</h3>
            <p className="text-sm text-muted-foreground truncate">{contactName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-client-menu">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView} data-testid="button-view-client">View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit} data-testid="button-edit-client">Edit Client</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {industry && (
          <div className="text-sm">
            <span className="text-muted-foreground">Industry:</span>{" "}
            <span className="font-medium">{industry}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate">{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{phone}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
