import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClientRequestCard } from "@/components/client-request-card";
import { CreateClientRequestDialog } from "@/components/create-client-request-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClientRequest } from "@shared/schema";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: requests, isLoading } = useQuery<ClientRequest[]>({
    queryKey: ["/api/client-requests"],
  });

  const filteredRequests = requests?.filter((request) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.clientName.toLowerCase().includes(searchLower) ||
      request.pointOfContact.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      request.initialTopicRequests.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Client Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage incoming training requests
          </p>
        </div>
        <CreateClientRequestDialog />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-requests"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" data-testid={`skeleton-${i}`} />
          ))}
        </div>
      ) : filteredRequests && filteredRequests.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <ClientRequestCard
              key={request.id}
              request={request}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-no-requests">
            {searchQuery
              ? "No requests found matching your search"
              : "No client requests yet. Create your first one!"}
          </p>
        </div>
      )}
    </div>
  );
}
