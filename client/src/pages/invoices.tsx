import { useState } from "react";
import { InvoiceCard } from "@/components/invoice-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const mockInvoices = [
    {
      id: "1",
      invoiceNumber: "INV-2025-001",
      clientName: "TechCorp Industries",
      amount: 45000,
      status: "paid" as const,
      dueDate: new Date(2025, 9, 30),
    },
    {
      id: "2",
      invoiceNumber: "INV-2025-002",
      clientName: "Global Innovations",
      amount: 32000,
      status: "pending" as const,
      dueDate: new Date(2025, 11, 15),
    },
    {
      id: "3",
      invoiceNumber: "INV-2025-003",
      clientName: "StartUp Labs",
      amount: 28500,
      status: "pending" as const,
      dueDate: new Date(2025, 9, 25),
    },
    {
      id: "4",
      invoiceNumber: "INV-2025-004",
      clientName: "Enterprise Solutions Ltd",
      amount: 52000,
      status: "paid" as const,
      dueDate: new Date(2025, 9, 15),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and manage training invoices</p>
        </div>
        <Button data-testid="button-create-invoice">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-invoices"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-invoices">All</TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending-invoices">Pending</TabsTrigger>
          <TabsTrigger value="paid" data-testid="tab-paid-invoices">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoiceNumber={invoice.invoiceNumber}
                clientName={invoice.clientName}
                amount={invoice.amount}
                status={invoice.status}
                dueDate={invoice.dueDate}
                onDownload={() => console.log("Download invoice", invoice.id)}
                onMarkPaid={() => console.log("Mark as paid", invoice.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockInvoices
              .filter((i) => i.status === "pending")
              .map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoiceNumber={invoice.invoiceNumber}
                  clientName={invoice.clientName}
                  amount={invoice.amount}
                  status={invoice.status}
                  dueDate={invoice.dueDate}
                  onDownload={() => console.log("Download invoice", invoice.id)}
                  onMarkPaid={() => console.log("Mark as paid", invoice.id)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {mockInvoices
              .filter((i) => i.status === "paid")
              .map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoiceNumber={invoice.invoiceNumber}
                  clientName={invoice.clientName}
                  amount={invoice.amount}
                  status={invoice.status}
                  dueDate={invoice.dueDate}
                  onDownload={() => console.log("Download invoice", invoice.id)}
                  onMarkPaid={() => console.log("Mark as paid", invoice.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
