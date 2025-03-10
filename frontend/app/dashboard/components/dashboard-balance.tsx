import { COUCHDB_URL } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { cookies } from "next/headers";

async function getUserId(): Promise<string | undefined> {
    const cookieStore = cookies();
    const cookie = (await cookieStore).get("AuthSession")?.value;

    const response = await fetch("http://localhost:3000/api/user/verify", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
            Cookie: `AuthSession=${cookie}`
        }
    });
    const data = await response.json();
    return data.session?.userCtx.name;
}

function getBalance({ userId }: { userId: string }): Promise<Response> {
    return fetch(`${COUCHDB_URL}/portfolio/${userId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Basic ${
                btoa("user:password")
            }`
        }
    });
}

export async function BalanceWidget() {
    const userId = await getUserId();
    const response = await getBalance({ userId: userId! });
    const responseJson = await response.json();
    return (
        <Card className="p-4 block overflow-hidden col-span-2">
            <h1 className="text-md font-bold text-gray-500">Balance</h1>
            <p className="text-4xl font-bold slide-up">${responseJson.balance}</p>
        </Card>
    );

}