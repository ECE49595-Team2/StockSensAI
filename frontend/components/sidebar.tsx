"use client";
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from "@/shadcn/ui/sidebar";
import NavigationItems from "@/app/nav-items";
import Link from "next/link";
import { Separator } from "@/shadcn/ui/separator";

const navigationItems: NavigationItemsType = NavigationItems;

interface NavigationItemsType {
    [key: string]: {
        title: string;
        description: string;
    };
}

function MainSidebar() {

    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar variant="floating" collapsible="offcanvas">
            <SidebarHeader className="flex flex-row items-center justify-center">
                <h1 className="font-anton text-2xl">
                    StockSensAI
                </h1>
            </SidebarHeader>
            <SidebarContent className="font-giest-mono text-xl">
                <ul>
                    <div className="p-4">
                        <Separator />
                        <Link href="/">
                            <li onClick={() => setOpenMobile(false)}>
                                Home
                            </li>
                        </Link>
                    </div>
                    {Object.keys(navigationItems).map((key: string) => (
                        <div key={key} className="p-4">
                            <Separator />
                            <Link href={key}>
                                <li onClick={() => setOpenMobile(false)}>
                                    {navigationItems[key].title}
                                </li>
                            </Link>
                        </div>
                    ))
                    }
                </ul>
            </SidebarContent>
        </Sidebar>
    )
}

export default MainSidebar;