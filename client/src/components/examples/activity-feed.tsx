import { ActivityFeed } from "../activity-feed";

export default function ActivityFeedExample() {
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
    <div className="p-4 max-w-md">
      <ActivityFeed activities={mockActivities} />
    </div>
  );
}
