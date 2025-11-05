import { QuickActions } from "../quick-actions";

export default function QuickActionsExample() {
  return (
    <div className="p-4 max-w-sm">
      <QuickActions
        onNewClient={() => console.log("New client")}
        onNewProposal={() => console.log("New proposal")}
        onNewSession={() => console.log("New session")}
        onNewInvoice={() => console.log("New invoice")}
      />
    </div>
  );
}
