import { useState } from "react";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Calendar as CalendarIcon } from "lucide-react";

export default function Sessions() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockSessions = [
    {
      id: "1",
      title: "AI Fundamentals Workshop",
      clientName: "TechCorp Industries",
      startDate: new Date(2025, 10, 7, 9, 0),
      endDate: new Date(2025, 10, 7, 17, 0),
      location: "Virtual - Zoom",
      participantCount: 25,
      status: "scheduled" as const,
    },
    {
      id: "2",
      title: "Product Management Masterclass",
      clientName: "Global Innovations",
      startDate: new Date(2025, 10, 8, 10, 0),
      endDate: new Date(2025, 10, 8, 16, 0),
      location: "Client Office, NYC",
      participantCount: 15,
      status: "in-progress" as const,
    },
    {
      id: "3",
      title: "Machine Learning Deep Dive",
      clientName: "StartUp Labs",
      startDate: new Date(2025, 9, 20, 9, 0),
      endDate: new Date(2025, 9, 20, 17, 0),
      location: "Virtual - Teams",
      participantCount: 30,
      status: "completed" as const,
    },
    {
      id: "4",
      title: "Advanced Product Strategy",
      clientName: "Enterprise Solutions Ltd",
      startDate: new Date(2025, 10, 12, 13, 0),
      endDate: new Date(2025, 10, 12, 18, 0),
      location: "Conference Center, SF",
      participantCount: 20,
      status: "scheduled" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Training Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage training sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-calendar-view">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button data-testid="button-schedule-session">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-sessions"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-sessions">All</TabsTrigger>
          <TabsTrigger value="scheduled" data-testid="tab-scheduled-sessions">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-inprogress-sessions">In Progress</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed-sessions">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockSessions.map((session) => (
              <SessionCard
                key={session.id}
                title={session.title}
                clientName={session.clientName}
                startDate={session.startDate}
                endDate={session.endDate}
                location={session.location}
                participantCount={session.participantCount}
                status={session.status}
                onView={() => console.log("View session", session.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockSessions
              .filter((s) => s.status === "scheduled")
              .map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  clientName={session.clientName}
                  startDate={session.startDate}
                  endDate={session.endDate}
                  location={session.location}
                  participantCount={session.participantCount}
                  status={session.status}
                  onView={() => console.log("View session", session.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockSessions
              .filter((s) => s.status === "in-progress")
              .map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  clientName={session.clientName}
                  startDate={session.startDate}
                  endDate={session.endDate}
                  location={session.location}
                  participantCount={session.participantCount}
                  status={session.status}
                  onView={() => console.log("View session", session.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockSessions
              .filter((s) => s.status === "completed")
              .map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  clientName={session.clientName}
                  startDate={session.startDate}
                  endDate={session.endDate}
                  location={session.location}
                  participantCount={session.participantCount}
                  status={session.status}
                  onView={() => console.log("View session", session.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
