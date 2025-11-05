import { ClientCard } from "../client-card";

export default function ClientCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <ClientCard
        companyName="TechCorp Industries"
        contactName="Sarah Johnson"
        email="sarah.j@techcorp.com"
        phone="+1 (555) 123-4567"
        industry="Technology"
        status="active"
        onView={() => console.log("View client")}
        onEdit={() => console.log("Edit client")}
      />
      <ClientCard
        companyName="Global Innovations"
        contactName="Michael Chen"
        email="m.chen@globalinnovations.io"
        phone="+1 (555) 987-6543"
        industry="Finance"
        status="active"
        onView={() => console.log("View client")}
        onEdit={() => console.log("Edit client")}
      />
      <ClientCard
        companyName="StartUp Labs"
        contactName="Emma Wilson"
        email="emma@startuplabs.com"
        industry="Software"
        status="pending"
        onView={() => console.log("View client")}
        onEdit={() => console.log("Edit client")}
      />
    </div>
  );
}
