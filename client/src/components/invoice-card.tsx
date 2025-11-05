import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface InvoiceCardProps {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: "pending" | "paid";
  dueDate: Date;
  onDownload?: () => void;
  onMarkPaid?: () => void;
}

export function InvoiceCard({
  invoiceNumber,
  clientName,
  amount,
  status,
  dueDate,
  onDownload,
  onMarkPaid,
}: InvoiceCardProps) {
  const isOverdue = status === "pending" && dueDate < new Date();

  return (
    <Card className="hover-elevate" data-testid={`card-invoice-${invoiceNumber}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base" data-testid="text-invoice-number">#{invoiceNumber}</h3>
            <p className="text-sm text-muted-foreground truncate">{clientName}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span className="text-xl font-semibold" data-testid="text-invoice-amount">
            ${amount.toLocaleString()}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Due Date:</span>{" "}
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {dueDate.toLocaleDateString()}
          </span>
        </div>
        {isOverdue && (
          <p className="text-xs text-destructive">Overdue</p>
        )}
        <div className="flex gap-2 mt-2">
          <Button onClick={onDownload} variant="outline" size="sm" className="flex-1" data-testid="button-download-invoice">
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          {status === "pending" && (
            <Button onClick={onMarkPaid} size="sm" className="flex-1" data-testid="button-mark-paid">
              Mark Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
