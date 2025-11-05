import { ProposalCard } from "../proposal-card";

export default function ProposalCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <ProposalCard
        title="AI Training Program - Q4 2025"
        clientName="TechCorp Industries"
        amount={45000}
        status="approved"
        createdDate={new Date(2025, 9, 15)}
        onView={() => console.log("View proposal")}
        onEdit={() => console.log("Edit proposal")}
      />
      <ProposalCard
        title="Product Management Bootcamp"
        clientName="Global Innovations"
        amount={32000}
        status="pending"
        createdDate={new Date(2025, 10, 1)}
        onView={() => console.log("View proposal")}
        onEdit={() => console.log("Edit proposal")}
      />
      <ProposalCard
        title="ML Workshop Series"
        clientName="StartUp Labs"
        amount={28500}
        status="draft"
        createdDate={new Date(2025, 10, 5)}
        onView={() => console.log("View proposal")}
        onEdit={() => console.log("Edit proposal")}
      />
    </div>
  );
}
