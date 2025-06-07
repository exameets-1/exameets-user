import { Job } from '@/lib/models/Job';
import dbConnect from '@/lib/dbConnect';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

function generateSiteMap(jobs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}/jobs</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${jobs
        .map(({ _id }) => {
          return `
            <url>
              <loc>${`${siteUrl}/jobs/${_id}`}</loc>
              <changefreq>daily</changefreq>
              <priority>0.8</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  await dbConnect();
  const jobs = await Job.find().select('_id');

  const sitemap = generateSiteMap(jobs);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {}