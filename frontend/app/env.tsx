export const COUCHDB_USER: string | undefined = process.env.COUCHDB_USER;
export const COUCHDB_PASSWORD: string | undefined = process.env.COUCHDB_PASSWORD;

export const COUCHDB_URL_AUTH = process.env.NODE_ENV === "production"
  ? `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@database:5984`
  : `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984`;

export const COUCHDB_URL = process.env.NODE_ENV === "production"
  ? `http://database:5984`
  : `http://localhost:5984`;

export const ALGO_URL = process.env.NODE_ENV === "production"
  ? "http://algorithmic-trader:8000"
  : "http://localhost:8000";

export const LLM_URL = process.env.NODE_ENV === "production"
  ? "http://llm-server:8011"
  : "http://localhost:8011";