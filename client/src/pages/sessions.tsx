import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TrainingSession } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, List, Plus, X, Download } from "lucide-react";
import { format } from "date-fns";

type ViewMode = "list" | "calendar";

export default function Sessions() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [instructor, setInstructor] = useState<string>("");
  const [deliveryMode, setDeliveryMode] = useState<string>("");

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (clientName) queryParams.append("clientName", clientName);
  if (instructor) queryParams.append("instructor", instructor);
  if (deliveryMode) queryParams.append("deliveryMode", deliveryMode);

  const { data: sessions = [], isLoading } = useQuery<TrainingSession[]>({
    queryKey: ["/api/training-sessions", startDate, endDate, clientName, instructor, deliveryMode],
    queryFn: async () => {
      const response = await fetch(`/api/training-sessions?${queryParams.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
  });

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setClientName("");
    setInstructor("");
    setDeliveryMode("");
  };

  const hasActiveFilters = startDate || endDate || clientName || instructor || deliveryMode;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "tentative":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "virtual":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "on-site":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "hybrid":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const handleExport = () => {
    const headers = ["Event Title", "Client Name", "Start Date", "End Date", "Delivery Mode", "Location", "Instructor", "Facilitators", "Status"];
    const csvContent = [
      headers.join(","),
      ...sessions.map(session => [
        `"${session.title}"`,
        `"${session.clientName}"`,
        `"${format(new Date(session.startDate), "yyyy-MM-dd HH:mm")}"`,
        `"${format(new Date(session.endDate), "yyyy-MM-dd HH:mm")}"`,
        `"${session.deliveryMode}"`,
        `"${session.location || session.virtualLink || ''}"`,
        `"${session.instructor}"`,
        `"${session.facilitators?.join("; ") || ''}"`,
        `"${session.status}"`,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `training-sessions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plan & Schedule Delivery</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all training sessions and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button data-testid="button-new-session">
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                data-testid="button-view-calendar"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div>
            <Label htmlFor="start-date" className="text-sm">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              data-testid="input-filter-start-date"
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="text-sm">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              data-testid="input-filter-end-date"
            />
          </div>
          <div>
            <Label htmlFor="client-name" className="text-sm">Client Name</Label>
            <Input
              id="client-name"
              type="text"
              placeholder="Search client..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              data-testid="input-filter-client"
            />
          </div>
          <div>
            <Label htmlFor="instructor" className="text-sm">Instructor</Label>
            <Input
              id="instructor"
              type="text"
              placeholder="Search instructor..."
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              data-testid="input-filter-instructor"
            />
          </div>
          <div>
            <Label htmlFor="delivery-mode" className="text-sm">Delivery Mode</Label>
            <Select value={deliveryMode} onValueChange={setDeliveryMode}>
              <SelectTrigger data-testid="select-filter-mode">
                <SelectValue placeholder="All modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All modes</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {viewMode === "list" && (
        <Card>
          <div className="p-4 border-b">
            <h2 className="font-semibold">Master Schedule - List View</h2>
            <p className="text-sm text-muted-foreground">
              Showing {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No sessions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event / Course Title</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Delivery Mode</TableHead>
                  <TableHead>Location / Link</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Facilitators</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="cursor-pointer hover-elevate"
                    data-testid={`row-session-${session.id}`}
                  >
                    <TableCell className="font-medium" data-testid={`text-title-${session.id}`}>
                      {session.title}
                    </TableCell>
                    <TableCell data-testid={`text-client-${session.id}`}>{session.clientName}</TableCell>
                    <TableCell data-testid={`text-date-${session.id}`}>
                      <div className="text-sm">
                        <div>{format(new Date(session.startDate), "MMM d, yyyy")}</div>
                        <div className="text-muted-foreground">
                          {format(new Date(session.startDate), "h:mm a")} - {format(new Date(session.endDate), "h:mm a")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getModeColor(session.deliveryMode)} data-testid={`badge-mode-${session.id}`}>
                        {session.deliveryMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" data-testid={`text-location-${session.id}`}>
                      {session.virtualLink || session.location || "-"}
                    </TableCell>
                    <TableCell data-testid={`text-instructor-${session.id}`}>{session.instructor}</TableCell>
                    <TableCell className="max-w-xs truncate" data-testid={`text-facilitators-${session.id}`}>
                      {session.facilitators?.join(", ") || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(session.status)} data-testid={`badge-status-${session.id}`}>
                        {session.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {viewMode === "calendar" && (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Calendar view coming soon</p>
            <p className="text-sm mt-2">This will display sessions in monthly and weekly calendar formats</p>
          </div>
        </Card>
      )}
    </div>
  );
}
