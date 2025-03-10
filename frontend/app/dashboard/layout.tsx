"use client";
import "../globals.css";
import DashboardSidebar from "./components/dashboard-sidebar";
import { SidebarProvider } from "@/shadcn/ui/sidebar";
import DashboardMenubar from "./components/dashboard-menubar";
import { motion, AnimatePresence } from "framer-motion";
import { use } from "react";
import { usePathname } from "next/navigation";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <div id="dashboard" className="flex flex-row h-screen w-screen bg-white font-geist-mono user-select-none">
                    <SidebarProvider defaultOpen={true}>
                        <DashboardSidebar />
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            id="dashboard-content"
                            className="flex grow-1 flex-col p-4 overflow-scroll border-box">
                            <DashboardMenubar />
                            {children}
                        </motion.div>
                    </SidebarProvider>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
