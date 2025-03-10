import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export type JsonObject = {
    [key: string]: any;
}

class API {
    static async get(url: string, headers?: JsonObject) {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });
    }

    static async post(url: string, data: JsonObject, headers?: JsonObject) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
    }

    static async put(url: string, data: JsonObject) {
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
    }
}

class DatabaseAPI extends API {
    static signup(email: string, password: string, name: string): boolean {
       let successful: boolean = false;
        this.post(`${COUCHDB_URL}/_users/org.couchdb.user:${email}`, {
            name: email,
            password: password,
            roles: ["user"],
            type: "user"
        }, {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}`,
        }).then(async (response) => {
            if (!response.ok) {
                return false;
            }

            this.post(`${COUCHDB_URL}/users/${email}`, {
                name: name,
                preferences: {}
            }).then(async (response) => {
                successful = response.ok;
            });
        });

        return successful;
    }

    static login(email: string, password: string): boolean {
        let authenticated: boolean = false;
        this.post(`${COUCHDB_URL}/_session`, {
            name: email,
            password: password,
        }, ).then(async (response) => {
            authenticated = response.ok;
        });

        return authenticated;
    }

    static verify(cookie: RequestCookie): boolean {
        let authenticated: boolean = false;
        this.get(`${COUCHDB_URL}/_session`, {
            Cookie: `AuthSession=${cookie}`,
        }).then(async (response) => {
            authenticated = response.ok;
        });

        return authenticated;
    }

}

export { DatabaseAPI };