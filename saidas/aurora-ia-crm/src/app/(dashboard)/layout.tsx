import Sidebar from "@/components/layout/sidebar";
import AuroraFloat from "@/components/aurora-float";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      <AuroraFloat />
    </div>
  );
}
