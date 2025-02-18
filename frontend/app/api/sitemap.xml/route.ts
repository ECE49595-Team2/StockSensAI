export async function GET() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://yourdomain.com/</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>
    </urlset>`;
  
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
}