import { COUCHDB_URL } from "@/app/env";
import { Card } from "@/shadcn/ui/card";
import { cookies } from "next/headers";

async function getUserId() {
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

function getPerformance({ userId }: { userId: string }) {
    return fetch(`${COUCHDB_URL}/portfolio/${userId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Basic ${btoa("user:password")}`
        }
    });
}

export async function DashboardPerformance() {
    const userId = await getUserId();
    const response = await getPerformance({ userId: userId! });
    const responseJson = await response.json();

    const symbol = responseJson.performance > 0 ? "📈" : "📉";
    const color = responseJson.performance > 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="p-4 block overflow-hidden col-span-3 min-h-[200px]">
        <h1 className="text-md font-bold text-gray-500">Performance</h1>
        <p className={`text-4xl font-bold slide-up ${color}`}>
            {symbol}{responseJson.performance}<sup className="text-gray-500">%</sup>
        </p>
    </Card>
  );
}

