import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pages = ["/", "/about/mission", "/about/team", "/about/tutorial"];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map(page => `<url><loc>https://example.com${page}</loc></url>`).join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.send(sitemap);
}