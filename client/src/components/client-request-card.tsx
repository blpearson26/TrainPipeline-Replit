import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, Users, MapPin, Eye, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import type { ClientRequest, ScopingCall } from "@shared/schema";
import { ClientRequestDetailDialog } from "./client-request-detail-dialog";

interface ClientRequestCardProps {
  request: ClientRequest;
}

export function ClientRequestCard({ request }: ClientRequestCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  
  const { data: scopingCalls } = useQuery<ScopingCall[]>({
    queryKey: ["/api/client-requests", request.id, "scoping-calls"],
  });

  const hasScopingCall = scopingCalls && scopingCalls.length > 0;

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
    <>
      <Card className="hover-elevate" data-testid={`card-request-${request.id}`}>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base truncate" data-testid={`text-client-${request.id}`}>
                {request.clientName}
              </CardTitle>
              {hasScopingCall && (
                <CheckCircle2 
                  className="h-4 w-4 text-green-500 flex-shrink-0" 
                  data-testid={`icon-scoping-complete-${request.id}`}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{request.pointOfContact}</p>
          </div>
          <Badge className={statusColors[request.status as keyof typeof statusColors]} data-testid={`badge-status-${request.id}`}>
            {request.status}
          </Badge>
        </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{request.email}</span>
          </div>
          {request.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{request.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>{request.numberOfAttendees} attendees</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{modeDisplay[request.mode as keyof typeof modeDisplay]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Scoping: {format(new Date(request.scopingCallDate), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {request.initialTopicRequests}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setDetailOpen(true)}
          data-testid={`button-view-${request.id}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>

    <ClientRequestDetailDialog
      request={request}
      open={detailOpen}
      onOpenChange={setDetailOpen}
    />
    </>
  );
}
