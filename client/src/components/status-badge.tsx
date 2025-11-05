import { Badge } from "@/components/ui/badge";

type StatusType = "draft" | "pending" | "approved" | "in-progress" | "completed" | "invoiced" | "paid" | "scheduled" | "active" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  "in-progress": { label: "In Progress", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  invoiced: { label: "Invoiced", variant: "outline" },
  paid: { label: "Paid", variant: "default" },
  scheduled: { label: "Scheduled", variant: "outline" },
  active: { label: "Active", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}
