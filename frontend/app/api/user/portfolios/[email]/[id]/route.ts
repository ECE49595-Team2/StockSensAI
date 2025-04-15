import { COUCHDB_PASSWORD, COUCHDB_URL, COUCHDB_USER } from "@/app/env";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { email: string, id: string} }) {
    const queries = await params;
    const id = queries.id;
    const email = queries.email;

    const response = await fetch(`${COUCHDB_URL}/portfolio/_design/queries/_view/portfolioById?key=${encodeURIComponent(JSON.stringify([email, id]))}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
        }
    });
    if(!response.ok) {
        return NextResponse.error();
    }
    const data = await response.json();
    const portfolio = data.rows[0].value;
    return NextResponse.json(portfolio);
}

export async function PUT(req: Request, { params }: { params: { email: string } }) {
    const email = params.email;
    const portfolio = await req.json();

    const response = await fetch(`${COUCHDB_URL}/portfolio/${email}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
        }
    });

    if (!response.ok) {
        return NextResponse.error();
    }

    const userPortfolio = await response.json();
    const portfolios = userPortfolio.portfolios || [];

    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256');
    const portfolioName = portfolio.name || "default";
    const hashedKey = hash.update(`${email}:${portfolioName}`).digest('hex');

    if(portfolios[hashedKey]) {
        return NextResponse.json({ message: "Portfolio already exists" }, { status: 400 });
    }

    const updatedPortfolios = {
        ...portfolios,
        [hashedKey]: portfolio,
    };

    userPortfolio.portfolios = updatedPortfolios;

    const updateResponse = await fetch(`${COUCHDB_URL}/portfolio/${email}`, {
        method: "PUT",
        body: JSON.stringify(userPortfolio),
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
            "Content-Type": "application/json",
        }
    });

    if (!updateResponse.ok) {
        return NextResponse.error();
    }

    return NextResponse.json(await updateResponse.json());
}

export async function DELETE(_: Request, { params }: { params: { email: string, id: string } }) {
    const queries = await params;
    const id = queries.id;
    const email = queries.email;

    const response = await fetch(`${COUCHDB_URL}/portfolio/${email}`, {
        method: "GET",
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
        }
    });

    if (!response.ok) {
        return NextResponse.error();
    }

    const userPortfolio = await response.json();
    const portfolios = userPortfolio.portfolios || {};

    if (!portfolios[id]) {
        return NextResponse.json({ message: "Portfolio not found" }, { status: 404 });
    }

    delete portfolios[id];

    userPortfolio.portfolios = portfolios;

    const updateResponse = await fetch(`${COUCHDB_URL}/portfolio/${email}`, {
        method: "PUT",
        body: JSON.stringify(userPortfolio),
        headers: {
            Authorization: `Basic ${btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`)}
            `,
            "Content-Type": "application/json",
        }
    });

    if (!updateResponse.ok) {
        return NextResponse.error();
    }
    return NextResponse.json(await updateResponse.json());
}