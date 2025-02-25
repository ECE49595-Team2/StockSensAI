"use client";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "@/shadcn/ui/breadcrumb";
import { SidebarTrigger } from "@/shadcn/ui/sidebar";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

function DashboardMenubar() {
    const pathname = usePathname();

    const pathArray = useMemo(() => {
        return pathname.split('/').filter(segment => segment).map(segment =>
            segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
        );
    }, [pathname]);


    return (
        <div className="menubar flex flex-row gap-3 items-center">
            <SidebarTrigger className="text-black" />
            <Breadcrumb>
                <BreadcrumbList>
                    {pathArray.map((segment, index) => (
                        <div key={index} className="flex flex-row items-center gap-3">
                            <BreadcrumbItem key={index}>
                                {segment}
                            </BreadcrumbItem>
                            {(index < pathArray.length - 1) && (
                                <BreadcrumbSeparator />
                            )}
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

export default DashboardMenubar;