"use client";
import { useState, createContext, useContext, useEffect } from "react";
import User, { Avatar } from "@/models/user-model";
import { usePathname } from "next/navigation";

type UserContextType = {
    user: User | undefined;
    setUser: (user: User | undefined) => void;
};

const UserContext = createContext<UserContextType>({ user: undefined, setUser: (user: User | undefined) => { } });

export function UserProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const checkCookie = async () => {
            const response = await fetch("/api/user/verify", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });
            const data = await response.json();

            if (data.success) {
                const user = new User(data.session?.userCtx.name);
                await user.fetchUserData();
                setUser(user);
            }
        };
        checkCookie();

        const interval = setInterval(() => {
            checkCookie();
        }
            , 60000);
        return () => clearInterval(interval);
    }
        , [pathname]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    return useContext(UserContext);
}

export default useUser;