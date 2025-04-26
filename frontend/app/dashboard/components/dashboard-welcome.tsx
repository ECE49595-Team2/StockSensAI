import { COUCHDB_URL } from "@/app/env";
import nano from "nano";
import { cookies } from "next/headers";


async function DashboardWelcome({ firstTime }: { firstTime?: boolean }) {
    try {
        const authSession = (await cookies()).get("AuthSession");
        const client = nano({
            url: COUCHDB_URL,
            requestDefaults: {
                headers: {
                    Cookie: `AuthSession=${authSession?.value}`,
                },
            }
        });
        const email = (await client.session()).userCtx.name;
        const prefsDb = client.db.use("prefs");
        const userPrefs = await prefsDb.get(email) as unknown as { prefs: { name: string } };
        const name = userPrefs?.prefs.name;


        return (
            <>
                {firstTime ? 
                    <h1 className="font-bold text-4xl font-anton text-background">Welcome to your dashboard, {name}</h1>
                    :
                    <h1 className="font-bold text-4xl font-anton text-background">Welcome back, {name}</h1>
                }
            </>
        );
    } catch (error) {
        console.error("Error fetching user preferences:", error);
        return (
            <>
                <h1 className="font-bold text-4xl text-red">Error fetching user preferences</h1>
            </>
        );
    }
}

export default DashboardWelcome;