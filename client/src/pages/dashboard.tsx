import { StatCard } from "@/components/stat-card";
import { SessionCard } from "@/components/session-card";
import { ActivityFeed } from "@/components/activity-feed";
import { QuickActions } from "@/components/quick-actions";
import { Users, FileText, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  //todo: remove mock functionality
  const mockActivities = [
    {
      id: "1",
      type: "session" as const,
      description: "AI Fundamentals Workshop scheduled for Nov 7, 2025",
      timestamp: new Date(2025, 10, 5, 14, 30),
    },
    {
      id: "2",
      type: "proposal" as const,
      description: "Product Management Bootcamp proposal sent to Global Innovations",
      timestamp: new Date(2025, 10, 5, 10, 15),
    },
    {
      id: "3",
      type: "invoice" as const,
      description: "Invoice INV-2025-001 marked as paid by TechCorp Industries",
      timestamp: new Date(2025, 10, 4, 16, 45),
    },
    {
      id: "4",
      type: "client" as const,
      description: "New client added: StartUp Labs",
      timestamp: new Date(2025, 10, 4, 11, 20),
    },
    {
      id: "5",
      type: "evaluation" as const,
      description: "15 evaluations received for ML Workshop Series",
      timestamp: new Date(2025, 10, 3, 15, 0),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your training pipeline overview.</p>
        </div>
        <Button data-testid="button-new-item">
          <Plus className="h-4 w-4 mr-2" />
          New Item
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Active Clients"
          value="24"
          icon={Users}
          change="+3 from last month"
          changeType="positive"
        />
        <StatCard
          title="Pending Proposals"
          value="8"
          icon={FileText}
          change="2 awaiting approval"
          changeType="neutral"
        />
        <StatCard
          title="Upcoming Sessions"
          value="12"
          icon={Calendar}
          change="Next: Tomorrow 9AM"
          changeType="neutral"
        />
        <StatCard
          title="Monthly Revenue"
          value="$48,500"
          icon={DollarSign}
          change="+12% from last month"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
            <Button variant="ghost" size="sm" data-testid="button-view-all-sessions">View All</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SessionCard
              title="AI Fundamentals Workshop"
              clientName="TechCorp Industries"
              startDate={new Date(2025, 10, 7, 9, 0)}
              endDate={new Date(2025, 10, 7, 17, 0)}
              location="Virtual - Zoom"
              participantCount={25}
              status="scheduled"
              onView={() => console.log("View session")}
            />
            <SessionCard
              title="Product Management Masterclass"
              clientName="Global Innovations"
              startDate={new Date(2025, 10, 8, 10, 0)}
              endDate={new Date(2025, 10, 8, 16, 0)}
              location="Client Office, NYC"
              participantCount={15}
              status="scheduled"
              onView={() => console.log("View session")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <ActivityFeed activities={mockActivities} />
          <QuickActions
            onNewClient={() => console.log("New client")}
            onNewProposal={() => console.log("New proposal")}
            onNewSession={() => console.log("New session")}
            onNewInvoice={() => console.log("New invoice")}
          />
        </div>
      </div>
    </div>
  );
}
