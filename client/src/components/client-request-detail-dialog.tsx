import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { ClientRequest, ScopingCall, CoordinationCall, EmailCommunication } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecordScopingCallDialog } from "./record-scoping-call-dialog";
import { RecordCoordinationCallDialog } from "./record-coordination-call-dialog";
import { AddEmailCommunicationDialog } from "./add-email-communication-dialog";
import { ScopingCallDetail } from "./scoping-call-detail";
import { CoordinationCallDetail } from "./coordination-call-detail";
import { EmailCommunicationDetail } from "./email-communication-detail";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Phone, Users, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("all");

  const { data: scopingCalls } = useQuery<ScopingCall[]>({
    queryKey: ["/api/client-requests", request.id, "scoping-calls"],
    enabled: open,
  });

  const { data: coordinationCalls } = useQuery<CoordinationCall[]>({
    queryKey: ["/api/client-requests", request.id, "coordination-calls"],
    enabled: open,
  });

  const { data: emailCommunications } = useQuery<EmailCommunication[]>({
    queryKey: ["/api/client-requests", request.id, "email-communications"],
    enabled: open,
  });

  const latestScopingCall = scopingCalls?.[0];

  const allCommunications = useMemo(() => {
    const items: Array<{ type: string; date: Date; data: any }> = [];

    scopingCalls?.forEach((call) => {
      items.push({
        type: "scoping",
        date: new Date(call.createdAt || 0),
        data: call,
      });
    });

    coordinationCalls?.forEach((call) => {
      items.push({
        type: "coordination",
        date: new Date(call.callDateTime),
        data: call,
      });
    });

    emailCommunications?.forEach((email) => {
      items.push({
        type: "email",
        date: new Date(email.sentDateTime),
        data: email,
      });
    });

    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [scopingCalls, coordinationCalls, emailCommunications]);

  const filteredCommunications = useMemo(() => {
    if (activeTab === "all") return allCommunications;
    return allCommunications.filter((comm) => comm.type === activeTab);
  }, [allCommunications, activeTab]);

  const hasAnyCommunications = allCommunications.length > 0;

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
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">Communication History</h3>
              <div className="flex gap-2 flex-wrap">
                <RecordScopingCallDialog
                  clientRequestId={request.id}
                  existingCall={latestScopingCall}
                />
                {latestScopingCall && (
                  <>
                    <RecordCoordinationCallDialog
                      clientRequestId={request.id}
                    />
                    <AddEmailCommunicationDialog
                      clientRequestId={request.id}
                    />
                  </>
                )}
              </div>
            </div>

            {hasAnyCommunications ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all" data-testid="tab-all">
                    All ({allCommunications.length})
                  </TabsTrigger>
                  <TabsTrigger value="scoping" data-testid="tab-scoping">
                    Scoping ({scopingCalls?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="coordination" data-testid="tab-coordination">
                    Coordination ({coordinationCalls?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="email" data-testid="tab-email">
                    Email ({emailCommunications?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                  {filteredCommunications.map((comm, index) => {
                    if (comm.type === "scoping") {
                      return (
                        <ScopingCallDetail
                          key={`scoping-${comm.data.id}`}
                          call={comm.data}
                          clientName={request.clientName}
                        />
                      );
                    } else if (comm.type === "coordination") {
                      return (
                        <CoordinationCallDetail
                          key={`coordination-${comm.data.id}`}
                          call={comm.data}
                          clientName={request.clientName}
                          clientRequestId={request.id}
                        />
                      );
                    } else if (comm.type === "email") {
                      return (
                        <EmailCommunicationDetail
                          key={`email-${comm.data.id}`}
                          email={comm.data}
                          clientName={request.clientName}
                        />
                      );
                    }
                    return null;
                  })}
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground" data-testid="text-no-communications">
                    No communications recorded yet. Start by recording the scoping call to capture details from your initial conversation with the client.
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
