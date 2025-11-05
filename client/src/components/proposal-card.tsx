import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface ProposalCardProps {
  title: string;
  clientName: string;
  amount: number;
  status: "draft" | "pending" | "approved";
  createdDate: Date;
  onView?: () => void;
  onEdit?: () => void;
}

export function ProposalCard({
  title,
  clientName,
  amount,
  status,
  createdDate,
  onView,
  onEdit,
}: ProposalCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-proposal-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid="text-proposal-title">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{clientName}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="text-xl font-semibold" data-testid="text-proposal-amount">
            ${amount.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Created {createdDate.toLocaleDateString()}
        </div>
        <div className="flex gap-2 mt-2">
          <Button onClick={onView} variant="outline" size="sm" className="flex-1" data-testid="button-view-proposal">
            View
          </Button>
          {status === "draft" && (
            <Button onClick={onEdit} size="sm" className="flex-1" data-testid="button-edit-proposal">
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
