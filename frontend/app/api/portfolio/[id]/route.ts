import { COUCHDB_URL } from "@/app/env";
import { NextResponse, NextRequest } from "next/server";
import nano from "nano";

export async function GET(_: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const client = nano(COUCHDB_URL);
  const db = client.db.use("portfolio");
  let response;
  try {
    response = await db.get(id);
  } catch (error) {
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

  return NextResponse.json(response,
    { status: 200 }
  )
}