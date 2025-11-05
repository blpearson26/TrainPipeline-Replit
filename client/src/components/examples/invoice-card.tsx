import { InvoiceCard } from "../invoice-card";

export default function InvoiceCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <InvoiceCard
        invoiceNumber="INV-2025-001"
        clientName="TechCorp Industries"
        amount={45000}
        status="paid"
        dueDate={new Date(2025, 9, 30)}
        onDownload={() => console.log("Download invoice")}
        onMarkPaid={() => console.log("Mark as paid")}
      />
      <InvoiceCard
        invoiceNumber="INV-2025-002"
        clientName="Global Innovations"
        amount={32000}
        status="pending"
        dueDate={new Date(2025, 11, 15)}
        onDownload={() => console.log("Download invoice")}
        onMarkPaid={() => console.log("Mark as paid")}
      />
      <InvoiceCard
        invoiceNumber="INV-2025-003"
        clientName="StartUp Labs"
        amount={28500}
        status="pending"
        dueDate={new Date(2025, 9, 25)}
        onDownload={() => console.log("Download invoice")}
        onMarkPaid={() => console.log("Mark as paid")}
      />
    </div>
  );
}
