import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      <StatusBadge status="draft" />
      <StatusBadge status="pending" />
      <StatusBadge status="approved" />
      <StatusBadge status="in-progress" />
      <StatusBadge status="completed" />
      <StatusBadge status="invoiced" />
      <StatusBadge status="paid" />
      <StatusBadge status="scheduled" />
      <StatusBadge status="active" />
      <StatusBadge status="cancelled" />
    </div>
  );
}
