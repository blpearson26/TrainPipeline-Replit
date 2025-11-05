import { SessionCard } from "../session-card";

export default function SessionCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <SessionCard
        title="AI Fundamentals Workshop"
        clientName="TechCorp Industries"
        startDate={new Date(2025, 10, 7, 9, 0)}
        endDate={new Date(2025, 10, 7, 17, 0)}
        location="Virtual - Zoom"
        participantCount={25}
        status="scheduled"
        onView={() => console.log("View session")}
      />
      <SessionCard
        title="Product Management Masterclass"
        clientName="Global Innovations"
        startDate={new Date(2025, 10, 8, 10, 0)}
        endDate={new Date(2025, 10, 8, 16, 0)}
        location="Client Office, NYC"
        participantCount={15}
        status="in-progress"
        onView={() => console.log("View session")}
      />
      <SessionCard
        title="Machine Learning Deep Dive"
        clientName="StartUp Labs"
        startDate={new Date(2025, 9, 20, 9, 0)}
        endDate={new Date(2025, 9, 20, 17, 0)}
        location="Virtual - Teams"
        participantCount={30}
        status="completed"
        onView={() => console.log("View session")}
      />
    </div>
  );
}
