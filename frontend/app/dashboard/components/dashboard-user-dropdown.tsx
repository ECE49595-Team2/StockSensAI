"use client";
import { useUser } from "@/hooks/use-user";
import User from "@/models/user-model";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shadcn/ui/sidebar";
import { Skeleton } from "@/shadcn/ui/skeleton";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, SettingsIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

function UserDropdown() {
    const { user, setUser } = useUser(useShallow((state) => {
        return {
            user: state.user,
            setUser: state.setUser
        }
    }));
    const router = useRouter();
    
    // useEffect(() => {
    //     fetch("/api/user/verify", {
    //         method: "GET",
    //         credentials: "include",
    //         cache: "no-store",
    //     }).then(async (response) => {
    //         const data = await response.json();
    //         if (data.success) {
    //             // const user = data.user;
    //             // setUser(new User(user?.email));
    //         }
    //     });

       
    // }, [setUser]);


    useEffect(() => {
        async function fetchUserData(email?: string) {
            if (!email) {
                return null;
            }
            const response = await fetch(`/api/user/prefs/${email}`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            const data = await response.json();
        
            if (response.ok) {
                setUser(new User(user!.email, data.name))
            } else {
                throw new Error("Failed to fetch user data");
            }
        }
        fetchUserData(user?.email);
    }, [user?.email, user?.name, setUser]);

    const logout = async () => {
        const response = await fetch("/api/user", {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = "/";
            sessionStorage.clear();
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