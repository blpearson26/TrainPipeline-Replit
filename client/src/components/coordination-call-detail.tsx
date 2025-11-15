import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Phone, Pencil } from "lucide-react";
import { format } from "date-fns";
import type { CoordinationCall } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { RecordCoordinationCallDialog } from "./record-coordination-call-dialog";

interface CoordinationCallDetailProps {
  call: CoordinationCall;
  clientName: string;
  clientRequestId: string;
}

export function CoordinationCallDetail({ call, clientName, clientRequestId }: CoordinationCallDetailProps) {
  const { toast } = useToast();

  const purposeLabels: Record<string, string> = {
    logistics_update: "Logistics Update",
    additional_content: "Additional Content Requests",
    instructor_confirmation: "Instructor Confirmation",
    participant_confirmation: "Participant Confirmation",
    general_update: "General Update",
  };

  const generateEmailSummary = () => {
    const callDate = format(new Date(call.callDateTime), "MMMM d, yyyy 'at' h:mm a");
    const recordedDate = call.createdAt ? format(new Date(call.createdAt), "MMMM d, yyyy") : "N/A";
    
    return `Coordination Call Summary - ${clientName}

Call Date/Time: ${callDate}
Purpose: ${purposeLabels[call.purpose] || call.purpose}

${call.attendeeRoles ? `Attendees:\n${call.attendeeRoles}\n\n` : ''}Summary of Discussion:
${call.summaryOfDiscussion}

${call.updatedObjectives ? `Updated Training Objectives:\n${call.updatedObjectives}\n\n` : ''}${call.additionalMaterials ? `Additional Materials Requested:\n${call.additionalMaterials}\n\n` : ''}${call.deliveryChanges ? `Delivery Changes:\n${call.deliveryChanges}\n\n` : ''}${call.followUpActions ? `Follow-Up Actions:\n${call.followUpActions}\n\n` : ''}${call.notes ? `Notes/Client Instructions:\n${call.notes}\n\n` : ''}---
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
              <Phone className="h-5 w-5" />
              Coordination Call Details
            </CardTitle>
            <CardDescription className="mt-1">
              {call.callDateTime && <>Call held on {format(new Date(call.callDateTime), "MMMM d, yyyy 'at' h:mm a")}</>}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={statusColors[call.status as keyof typeof statusColors]} 
              data-testid="badge-call-status"
            >
              {call.status}
            </Badge>
            <RecordCoordinationCallDialog
              clientRequestId={clientRequestId}
              existingCall={call}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              data-testid="button-copy-summary"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Email Summary
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Purpose</h4>
            <p className="text-muted-foreground">{purposeLabels[call.purpose] || call.purpose}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Summary of Discussion</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{call.summaryOfDiscussion}</p>
          </div>

          {call.attendeeRoles && (
            <div>
              <h4 className="font-medium mb-2">Attendees and Roles</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.attendeeRoles}</p>
            </div>
          )}

          {call.updatedObjectives && (
            <div>
              <h4 className="font-medium mb-2">Updated Training Objectives</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.updatedObjectives}</p>
            </div>
          )}

          {call.additionalMaterials && (
            <div>
              <h4 className="font-medium mb-2">Additional Materials Requested</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.additionalMaterials}</p>
            </div>
          )}

          {call.deliveryChanges && (
            <div>
              <h4 className="font-medium mb-2">Delivery Changes</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.deliveryChanges}</p>
            </div>
          )}

          {call.followUpActions && (
            <div>
              <h4 className="font-medium mb-2">Follow-Up Actions</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.followUpActions}</p>
            </div>
          )}

          {call.notes && (
            <div>
              <h4 className="font-medium mb-2">Notes / Client Instructions</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{call.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>Created by: {call.createdBy}</p>
            {call.createdAt && <p>Created on: {format(new Date(call.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>}
            {call.updatedAt && call.updatedAt !== call.createdAt && (
              <>
                <p>Last modified by: {call.lastModifiedBy}</p>
                <p>Last updated: {format(new Date(call.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
