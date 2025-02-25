export const COUCHDB_URL = process.env.NODE_ENV === "production" ? "http://database:5984" : "http://localhost:5984";

export const COUCHDB_USER: string | undefined = process.env.COUCHDB_USER;
export const COUCHDB_PASSWORD: string | undefined = process.env.COUCHDB_PASSWORD;