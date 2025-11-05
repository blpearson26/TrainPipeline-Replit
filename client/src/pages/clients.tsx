import { useState } from "react";
import { ClientCard } from "@/components/client-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockClients = [
    {
      id: "1",
      companyName: "TechCorp Industries",
      contactName: "Sarah Johnson",
      email: "sarah.j@techcorp.com",
      phone: "+1 (555) 123-4567",
      industry: "Technology",
      status: "active" as const,
    },
    {
      id: "2",
      companyName: "Global Innovations",
      contactName: "Michael Chen",
      email: "m.chen@globalinnovations.io",
      phone: "+1 (555) 987-6543",
      industry: "Finance",
      status: "active" as const,
    },
    {
      id: "3",
      companyName: "StartUp Labs",
      contactName: "Emma Wilson",
      email: "emma@startuplabs.com",
      phone: "+1 (555) 456-7890",
      industry: "Software",
      status: "pending" as const,
    },
    {
      id: "4",
      companyName: "Enterprise Solutions Ltd",
      contactName: "David Martinez",
      email: "d.martinez@enterprisesol.com",
      phone: "+1 (555) 321-9876",
      industry: "Consulting",
      status: "active" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your training clients and contacts</p>
        </div>
        <Button data-testid="button-add-client">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-clients"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {mockClients.map((client) => (
          <ClientCard
            key={client.id}
            companyName={client.companyName}
            contactName={client.contactName}
            email={client.email}
            phone={client.phone}
            industry={client.industry}
            status={client.status}
            onView={() => console.log("View client", client.id)}
            onEdit={() => console.log("Edit client", client.id)}
          />
        ))}
      </div>
    </div>
  );
}
