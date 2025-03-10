import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { cookies } from "next/headers";

async function getPortfolio({ userId }: { userId: string }) {
    return fetch(`${COUCHDB_URL}/portfolio/${userId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}`,
        }
    });
}

async function getUserId() {
    const cookieStore = cookies();
    const cookie = (await cookieStore).get("AuthSession")?.value;
    const response = await fetch("http://localhost:3000/api/user/verify",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
                Cookie: `AuthSession=${cookie}`,
            },
        }
    );
    const data = await response.json();
    return data.session?.userCtx.name;
}

export async function PortfolioValueWidget() {
    const userId = await getUserId();
    const response = await getPortfolio({ userId: userId });
    const responseJson = await response.json();
    return (
        <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Portfolio</h1>
            <p className="text-4xl font-bold slide-up">${responseJson.portfolio}</p>
        </Card>
    );

}