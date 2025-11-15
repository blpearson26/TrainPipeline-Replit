import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, Users, MapPin, Eye } from "lucide-react";
import { format } from "date-fns";
import type { ClientRequest } from "@shared/schema";

interface ClientRequestCardProps {
  request: ClientRequest;
  onView: () => void;
}

export function ClientRequestCard({ request, onView }: ClientRequestCardProps) {
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
    <Card className="hover-elevate" data-testid={`card-request-${request.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate" data-testid={`text-client-${request.id}`}>
            {request.clientName}
          </CardTitle>
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
          onClick={onView}
          data-testid={`button-view-${request.id}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
