import "../globals.css";
import DashboardMenubar from "./components/dashboard-menubar";
import DashboardSidebar from "./components/dashboard-sidebar";
import { SidebarProvider } from "@/shadcn/ui/sidebar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div id="dashboard" className="flex flex-row h-screen w-screen bg-white font-geist-mono user-select-none">
            <SidebarProvider defaultOpen={true}>
                <DashboardSidebar />
                <div
                    className="flex grow-1 flex-col p-4 overflow-scroll border-box">
                    <DashboardMenubar />
                    {children}
                </div>
            </SidebarProvider>
        </div>
    );
}
