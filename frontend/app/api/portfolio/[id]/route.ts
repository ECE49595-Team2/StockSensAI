import { COUCHDB_URL, COUCHDB_USER, COUCHDB_PASSWORD } from "@/app/env";
import { NextResponse, NextRequest } from "next/server";

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const url = `${COUCHDB_URL}/portfolio/_design/portfolio_search/_view/by_portfolio_id?key="${encodeURIComponent(id)}"&include_docs=false`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("CouchDB error:", errorText);
    return NextResponse.json({ message: "CouchDB error", detail: errorText }, { status: response.status });
  }

  const json = await response.json();

  const portfolio = json.rows?.[0]?.value?.portfolios?.[id];

  if (!portfolio) {
    return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
  }

  return NextResponse.json(portfolio);
}