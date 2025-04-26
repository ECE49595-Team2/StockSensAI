"use server";
import { Button } from "@/shadcn/ui/button";
import nano from "nano";
import { cookies } from "next/headers";
import { COUCHDB_URL } from "@/app/env";
import Combobox from "@/components/combobox";
import { SettingsType } from "./section";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import Settings_Client from "./settings-client";

async function Settings() {
    const authSession = (await cookies()).get("AuthSession");
    if (!authSession) {
        // Redirect to login if AuthSession cookie is not present
        return <p className="text-red-500">You must be logged in to view this page.</p>;
    }
    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession.value}`,
            },
        },
    });
    const email = (await client.session()).userCtx.name;
    if (!email || email === "null" || email === "admin") {
        // Redirect to login if user is not authenticated
        return <p className="text-red-500">You must be logged in to view this page.</p>;
    }
    const prefsDb = client.db.use("prefs");
    const userPrefs = await prefsDb.get(email) as unknown as { prefs: { [key: string]: any } };
    const prefs: { [key: string]: any } = userPrefs.prefs;
    const name: string = prefs.name;

    return (
        <div className="w-full h-full flex flex-col gap-10 text-black justify-start">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-md text-gray-500">Update your preferences and manage account details.</p>
                <div className="flex flex-row gap-4 items-center mt-5">
                    <Avatar className="p-10">
                        <AvatarFallback className="bg-gray-200 rounded-full p-10 shadow aspect-square text-xl">{name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h1 className="text-2xl text-background font-bold">{name}</h1>
                        <h2 className="italic">{email}</h2>
                    </div>
                </div>
            </div>
            <Settings_Client savedSettings={userPrefs.prefs} />
        </div>
    );
}

export default Settings;