import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileText } from "lucide-react";
import { format } from "date-fns";
import type { ScopingCall } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ScopingCallDetailProps {
  call: ScopingCall;
  clientName: string;
}

export function ScopingCallDetail({ call, clientName }: ScopingCallDetailProps) {
  const { toast } = useToast();

  const generateEmailSummary = () => {
    const recordedDate = call.createdAt ? format(new Date(call.createdAt), "MMMM d, yyyy") : "N/A";
    return `Scoping Call Summary - ${clientName}

Attendee Roles: ${call.attendeeRoles}

Training Objectives:
${call.trainingObjectives}

Delivery Details:
- Mode: ${call.deliveryMode}
- Duration: ${call.duration}
- Preferred Time Window: ${call.preferredTimeWindow}
- Number of Participants: ${call.numberOfParticipants}

${call.specialRequirements ? `Special Requirements:\n${call.specialRequirements}\n\n` : ''}${call.notes ? `Additional Notes:\n${call.notes}\n\n` : ''}---
Recorded on: ${recordedDate}`;
  };

  const copyToClipboard = () => {
    const summary = generateEmailSummary();
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to clipboard",
      description: "Email summary has been copied to your clipboard",
    });
  };

  const statusColors = {
    draft: "bg-yellow-500",
    submitted: "bg-green-500",
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scoping Call Details
            </CardTitle>
            <CardDescription className="mt-1">
              {call.createdAt && <>Recorded on {format(new Date(call.createdAt), "MMMM d, yyyy")}</>}
              {call.updatedAt && call.createdAt && call.updatedAt !== call.createdAt && (
                <> • Last updated {format(new Date(call.updatedAt), "MMMM d, yyyy")}</>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[call.status as keyof typeof statusColors]} data-testid="badge-status">
              {call.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              data-testid="button-copy-summary"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Attendee Roles</h3>
              <p className="text-sm" data-testid="text-attendee-roles">{call.attendeeRoles}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Delivery Mode</h3>
              <p className="text-sm capitalize" data-testid="text-delivery-mode">{call.deliveryMode}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Training Objectives</h3>
            <p className="text-sm whitespace-pre-wrap" data-testid="text-objectives">{call.trainingObjectives}</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Duration</h3>
              <p className="text-sm" data-testid="text-duration">{call.duration}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Preferred Time Window</h3>
              <p className="text-sm" data-testid="text-time-window">{call.preferredTimeWindow}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Number of Participants</h3>
              <p className="text-sm" data-testid="text-participants">{call.numberOfParticipants}</p>
            </div>
          </div>

          {call.specialRequirements && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Special Requirements</h3>
              <p className="text-sm whitespace-pre-wrap" data-testid="text-requirements">{call.specialRequirements}</p>
            </div>
          )}

          {call.notes && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Additional Notes</h3>
              <p className="text-sm whitespace-pre-wrap" data-testid="text-notes">{call.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
