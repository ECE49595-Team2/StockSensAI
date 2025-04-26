import { COUCHDB_URL } from "@/app/env";
import { NextRequest, NextResponse } from "next/server";
import nano from "nano";
import { parse } from "cookie";
import { cookies } from "next/headers";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const queries = await params;
  const id = queries.id;
  const authSession = (await cookies()).get("AuthSession");
  if (!authSession) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = nano({
    url: COUCHDB_URL,
    requestDefaults: {
      headers: {
        Cookie: `AuthSession=${authSession.value}`,
      },
    },
  });
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

export async function PUT(req: Request, { params }: { params: Promise<{ email: string, id: string }> }) {
    const queries = await params;
    const { id } = queries;
    const { name, description } = await req.json();

    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${parse(req.headers.get('cookie') || '').AuthSession}`,
            },
        },
    });
    const db = client.db.use("portfolio");
    const email = (await client.session()).userCtx.name;

    try {
        await db.insert({
            _id: id,
            date_created: new Date().toISOString(),
            user: email,
            name: name,
            description: description,
            transactions: {},
            buying_power: [
              [100000, new Date().toISOString()],
            ],
            positions: {},
            account_value_history: [],
            strategy_id: "",
        } as {
            _id: string;
            date_created: string;
            user: string;
            name: string;
            description: string;
            transactions: { [key: string] : []}; 
            buying_power: number[][]; 
            positions: { [key: string]: number };
            account_value_history: object[]; 
            strategy_id: string;
        });
    } catch {
        return NextResponse.json(
            { error: "Portfolio not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const queries = await params;
    const id = queries.id;
    const cookies = parse(req.headers.get('cookie') || '');
    const authSession = cookies.AuthSession;

    const client = nano({
        url: COUCHDB_URL,
        requestDefaults: {
            headers: {
                Cookie: `AuthSession=${authSession}`,
            },
        },
    });
    const userId = (await client.session()).userCtx.name;
    const db = client.db.use("portfolio");
    const doc = await db.get(id) as { _id: string; _rev: string; user: string } | null;
    if (!doc) {
        return NextResponse.json(
            { error: "Portfolio not found" },
            { status: 404 }
        );
    }
    if (doc.user !== userId) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 403 }
        );
    }
    await db.destroy(id, doc._rev);

    return NextResponse.json({ success: true }, { status: 200 });
}