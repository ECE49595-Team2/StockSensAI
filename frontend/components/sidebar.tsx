"use client";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/shadcn/ui/sidebar";
import NavigationItems from "@/app/nav-items";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import { useRouter } from "next/navigation";

const navigationItems: NavigationItemsType = NavigationItems;

interface NavigationItemsType {
    [key: string]: {
        title: string;
        description: string;
        subroutes: {
            [key: string]: string;
        }
    };
}

function MainSidebar() {

    const { setOpenMobile } = useSidebar();
    const navigator = useRouter();

    const navigate = (url: string) => () => {
        setOpenMobile(false);
        navigator.push(url);
    }

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

                        <SidebarMenuButton size={'lg'} onClick={navigate('/')}>
                            Home
                        </SidebarMenuButton>

                    </div>
                    {Object.keys(navigationItems).map((key: string) => (
                        <div key={key} className="p-4">
                            <Separator />
                            <SidebarMenuItem>
                                <p className="text-sm">{navigationItems[key].title}</p>
                            </SidebarMenuItem>
                            <SidebarMenuSub key={key}>

                                {Object.keys(navigationItems[key].subroutes).map((subkey: string) => (
                                    <SidebarMenuSubItem key={subkey}>

                                        <SidebarMenuSubButton size="md" onClick={navigate(subkey)}>
                                            {navigationItems[key].subroutes[subkey]}
                                        </SidebarMenuSubButton>

                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </div>
                    ))
                    }
                </ul>
                <div className="p-4 w-full flex justify-center">
                    <Button variant="default">Get Started</Button>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}

export default MainSidebar;