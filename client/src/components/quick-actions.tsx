import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, FileText, Calendar, DollarSign } from "lucide-react";

interface QuickActionsProps {
  onNewClient?: () => void;
  onNewProposal?: () => void;
  onNewSession?: () => void;
  onNewInvoice?: () => void;
}

export function QuickActions({
  onNewClient,
  onNewProposal,
  onNewSession,
  onNewInvoice,
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={onNewClient}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-new-client"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          New Client
        </Button>
        <Button
          onClick={onNewProposal}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-new-proposal"
        >
          <FileText className="h-4 w-4 mr-2" />
          New Proposal
        </Button>
        <Button
          onClick={onNewSession}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-new-session"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
        <Button
          onClick={onNewInvoice}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-new-invoice"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </CardContent>
    </Card>
  );
}
