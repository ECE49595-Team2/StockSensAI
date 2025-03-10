import { COUCHDB_URL } from "@/app/env"
import { cookies } from "next/headers";

export default async function Title() {
    let name;
    let email;

    const response = await fetch(`${COUCHDB_URL}/_users`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Basic ${btoa("user:password")}`,
        }
    })
    response.json().then((data) => {
        if (data.prefs?.name) {
            email = data.userCtx.name;
        }
    });


    const user = await fetch(`${COUCHDB_URL}/_users/org.couchdb.user:${name}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Basic ${btoa("user:password")}`
        }
    });
    await user.json().then((data) => {
        if (data.prefs?.name) {
            name = data.prefs.name;
        }
    });


    return <h1>Welcome in, {name}!</h1>
}