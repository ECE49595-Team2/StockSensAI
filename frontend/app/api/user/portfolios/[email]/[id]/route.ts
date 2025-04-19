import { NextResponse } from 'next/server';
import { COUCHDB_URL_AUTH } from '@/app/env';
import nano from 'nano';

export async function PUT(req: Request, { params }: { params: Promise<{ email: string, id: string }> }) {
    const queries = await params;
    const { email, id } = queries;
    const { name } = await req.json();

    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("portfolio");

    try {
        await db.insert({
            _id: id,
            date_created: new Date().toISOString(),
            user: email,
            name: name,
            transactions: [],
            buying_power: [],
            positions: {},
            account_value_history: [],
            strategy_id: "",
        } as {
            _id: string;
            date_created: string;
            user: string;
            name: string;
            transactions: object[]; 
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

export async function DELETE(req: Request, { params }: { params: Promise<{ email: string, id: string }> }) {
    const queries = await params;
    const { email, id } = queries;

    const client = nano(COUCHDB_URL_AUTH);
    const db = client.db.use("portfolio");
    const doc = await db.get(id);
    if (!doc) {
        return NextResponse.json(
            { error: "Portfolio not found" },
            { status: 404 }
        );
    }
    await db.destroy(id, doc._rev);

    return NextResponse.json({ success: true }, { status: 200 });
}