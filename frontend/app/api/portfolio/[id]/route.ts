import { COUCHDB_URL } from "@/app/env";
import { NextRequest, NextResponse } from "next/server";
import nano from "nano";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const queries = await params;
  const id = queries.id;

  const client = nano(COUCHDB_URL);
  const db = client.db.use("portfolio");
  let response;
  try {
    response = await db.get(id);
  } catch {
    return NextResponse.json(
      { error: "Portfolio not found" },
      { status: 404 }
    );
  }

  if (!response) {
    return NextResponse.json(
      { error: "Portfolio not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(response, { status: 200 });
}