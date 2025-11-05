import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, DollarSign, Users, CheckCircle2 } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "session" | "proposal" | "invoice" | "client" | "evaluation";
  description: string;
  timestamp: Date;
}

const activityIcons = {
  session: Calendar,
  proposal: FileText,
  invoice: DollarSign,
  client: Users,
  evaluation: CheckCircle2,
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
