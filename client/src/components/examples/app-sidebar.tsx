import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <AppSidebar />
    </SidebarProvider>
  );
}
