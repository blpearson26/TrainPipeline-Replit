import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { format } from "date-fns";

interface SessionCardProps {
  title: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  participantCount?: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  onView?: () => void;
}

export function SessionCard({
  title,
  clientName,
  startDate,
  endDate,
  location,
  participantCount,
  status,
  onView,
}: SessionCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-session-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate" data-testid="text-session-title">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{clientName}</p>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{format(startDate, "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}</span>
        </div>
        {location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {participantCount && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{participantCount} participants</span>
          </div>
        )}
        <Button onClick={onView} variant="outline" size="sm" className="w-full mt-2" data-testid="button-view-session">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
