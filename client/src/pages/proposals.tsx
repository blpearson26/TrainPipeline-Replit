import { useState } from "react";
import { ProposalCard } from "@/components/proposal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";

export default function Proposals() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockProposals = [
    {
      id: "1",
      title: "AI Training Program - Q4 2025",
      clientName: "TechCorp Industries",
      amount: 45000,
      status: "approved" as const,
      createdDate: new Date(2025, 9, 15),
    },
    {
      id: "2",
      title: "Product Management Bootcamp",
      clientName: "Global Innovations",
      amount: 32000,
      status: "pending" as const,
      createdDate: new Date(2025, 10, 1),
    },
    {
      id: "3",
      title: "ML Workshop Series",
      clientName: "StartUp Labs",
      amount: 28500,
      status: "draft" as const,
      createdDate: new Date(2025, 10, 5),
    },
    {
      id: "4",
      title: "Advanced AI Concepts",
      clientName: "Enterprise Solutions Ltd",
      amount: 52000,
      status: "approved" as const,
      createdDate: new Date(2025, 9, 20),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Proposals</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage training proposals</p>
        </div>
        <Button data-testid="button-create-proposal">
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-proposals"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-proposals">All</TabsTrigger>
          <TabsTrigger value="draft" data-testid="tab-draft-proposals">Draft</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending-proposals">Pending</TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved-proposals">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                title={proposal.title}
                clientName={proposal.clientName}
                amount={proposal.amount}
                status={proposal.status}
                createdDate={proposal.createdDate}
                onView={() => console.log("View proposal", proposal.id)}
                onEdit={() => console.log("Edit proposal", proposal.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockProposals
              .filter((p) => p.status === "draft")
              .map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  title={proposal.title}
                  clientName={proposal.clientName}
                  amount={proposal.amount}
                  status={proposal.status}
                  createdDate={proposal.createdDate}
                  onView={() => console.log("View proposal", proposal.id)}
                  onEdit={() => console.log("Edit proposal", proposal.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockProposals
              .filter((p) => p.status === "pending")
              .map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  title={proposal.title}
                  clientName={proposal.clientName}
                  amount={proposal.amount}
                  status={proposal.status}
                  createdDate={proposal.createdDate}
                  onView={() => console.log("View proposal", proposal.id)}
                  onEdit={() => console.log("Edit proposal", proposal.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockProposals
              .filter((p) => p.status === "approved")
              .map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  title={proposal.title}
                  clientName={proposal.clientName}
                  amount={proposal.amount}
                  status={proposal.status}
                  createdDate={proposal.createdDate}
                  onView={() => console.log("View proposal", proposal.id)}
                  onEdit={() => console.log("Edit proposal", proposal.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
