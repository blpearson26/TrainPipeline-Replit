import { StatCard } from "../stat-card";
import { Users, FileText, Calendar, DollarSign } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <StatCard
        title="Active Clients"
        value="24"
        icon={Users}
        change="+3 from last month"
        changeType="positive"
      />
      <StatCard
        title="Pending Proposals"
        value="8"
        icon={FileText}
        change="2 awaiting approval"
        changeType="neutral"
      />
      <StatCard
        title="Upcoming Sessions"
        value="12"
        icon={Calendar}
        change="Next: Tomorrow 9AM"
        changeType="neutral"
      />
      <StatCard
        title="Monthly Revenue"
        value="$48,500"
        icon={DollarSign}
        change="+12% from last month"
        changeType="positive"
      />
    </div>
  );
}
