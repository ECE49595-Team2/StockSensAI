import useUser from "@/hooks/use-user";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shadcn/ui/sidebar";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, SettingsIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function UserDropdown() {
    const { user } = useUser();
    const router = useRouter();

    const logout = async () => {
        const response = await fetch("/api/user", {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = "/";
        } else {
            toast.error("Failed to logout. Try again.", {
                description: "Server error", 
                richColors: true,
                position: "top-center",
            })
        }
    }

    return (
        <SidebarMenu className="w-full">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="w-full cursor-pointer" size={'lg'}>
                            <span className="flex-1 flex flex-row items-center gap-2">
                                Hello,&nbsp;
                                {user ? user.name : <Skeleton className="w-10 h-3 bg-gray-200" />}
                            </span>
                            <ChevronsUpDown />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                        <DropdownMenuItem className="w-full h-15 cursor-pointer" onClick={() => router.push("/dashboard/settings")}>
                                {<SettingsIcon />}
                                Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full h-15 focus:bg-red-500 text-red-500 focus:text-white cursor-pointer" onClick={logout}>
                            {<Trash className="text-red focus:text-white" />}
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default UserDropdown;