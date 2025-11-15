import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { ClientRequest, ScopingCall, CoordinationCall } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecordScopingCallDialog } from "./record-scoping-call-dialog";
import { RecordCoordinationCallDialog } from "./record-coordination-call-dialog";
import { ScopingCallDetail } from "./scoping-call-detail";
import { CoordinationCallDetail } from "./coordination-call-detail";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Phone, Users, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface ClientRequestDetailDialogProps {
  request: ClientRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientRequestDetailDialog({
  request,
  open,
  onOpenChange,
}: ClientRequestDetailDialogProps) {
  const { data: scopingCalls } = useQuery<ScopingCall[]>({
    queryKey: ["/api/client-requests", request.id, "scoping-calls"],
    enabled: open,
  });

  const { data: coordinationCalls } = useQuery<CoordinationCall[]>({
    queryKey: ["/api/client-requests", request.id, "coordination-calls"],
    enabled: open,
  });

  const latestScopingCall = scopingCalls?.[0];
  const hasAnyCalls = (scopingCalls && scopingCalls.length > 0) || (coordinationCalls && coordinationCalls.length > 0);

  const statusColors = {
    new: "bg-blue-500",
    contacted: "bg-yellow-500",
    scoping: "bg-purple-500",
    proposal: "bg-orange-500",
    accepted: "bg-green-500",
    declined: "bg-red-500",
  };

  const modeDisplay = {
    virtual: "Virtual",
    "in-person": "In-Person",
    blended: "Blended",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pr-8">
          <div className="flex-1">
            <DialogTitle className="text-2xl" data-testid="text-client-name">
              {request.clientName}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {request.pointOfContact}
            </p>
          </div>
          <Badge className={statusColors[request.status as keyof typeof statusColors]} data-testid="badge-status">
            {request.status}
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-email">{request.email}</span>
                </div>
                {request.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span data-testid="text-phone">{request.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-attendees">{request.numberOfAttendees} attendees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-mode">{modeDisplay[request.mode as keyof typeof modeDisplay]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-scoping-date">
                    Scoping call scheduled: {format(new Date(request.scopingCallDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-sm mb-2">Initial Topic Requests</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid="text-topics">
                  {request.initialTopicRequests}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Communication History</h3>
              <div className="flex gap-2">
                <RecordScopingCallDialog
                  clientRequestId={request.id}
                  existingCall={latestScopingCall}
                />
                {latestScopingCall && (
                  <RecordCoordinationCallDialog
                    clientRequestId={request.id}
                  />
                )}
              </div>
            </div>

            {hasAnyCalls ? (
              <div className="space-y-6">
                {latestScopingCall && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Scoping Call</h4>
                    <ScopingCallDetail call={latestScopingCall} clientName={request.clientName} />
                  </div>
                )}

                {coordinationCalls && coordinationCalls.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Coordination Calls ({coordinationCalls.length})
                    </h4>
                    <div className="space-y-4">
                      {coordinationCalls.map((call) => (
                        <CoordinationCallDetail
                          key={call.id}
                          call={call}
                          clientName={request.clientName}
                          clientRequestId={request.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground" data-testid="text-no-calls">
                    No calls recorded yet. Click "Record Scoping Call" to capture details from your initial conversation with the client.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
