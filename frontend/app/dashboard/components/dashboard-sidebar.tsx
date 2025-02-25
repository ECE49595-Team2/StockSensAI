"use client";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenuItem, SidebarGroupLabel, SidebarGroupContent, SidebarMenuButton, SidebarMenu, SidebarFooter } from "@/shadcn/ui/sidebar";
import NavigationItems from "../nav-items";
import { JSX } from "react";
import UserDropdown from "./dashboard-user-dropdown";
import { usePathname, useRouter } from "next/navigation";

type NavigationItems = {
    [key: string]: {
        title: string;
        icon: JSX.Element;
        description: string;
        subroutes: {
            [key: string]: string;
        }
    }
}

const navigationItems = NavigationItems as unknown as NavigationItems;

function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Sidebar variant="sidebar" collapsible="offcanvas" className="h-screen">
            <SidebarHeader className="flex flex-row items-center justify-center">
                <h1 className="font-anton text-2xl text-background">
                    StockSensAI
                </h1>
            </SidebarHeader>
            <SidebarContent className="font-giest-mono text-xl flex flex-col justify-between">
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Object.keys(NavigationItems).map((key: string) => (
                                <SidebarMenuItem key={key}>
                                    {key !== "/dashboard/settings" &&
                                        <SidebarMenuButton size={'lg'} onClick={() => { router.push(key) }} className={`cursor-pointer hover:bg-secondary ${pathname === key ? 'bg-primary text-white' : ''}`}>
                                            {navigationItems[key].icon}
                                            {navigationItems[key].title}
                                        </SidebarMenuButton>
                                    }
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter className="w-full">
                   <UserDropdown />
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    )
}

export default DashboardSidebar;