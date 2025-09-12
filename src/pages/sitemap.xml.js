import dbConnect from '@/lib/dbConnect';
import { Job } from '@/lib/models/Job';
import { GovtJob } from '@/lib/models/GovtJob';
import { Admission } from '@/lib/models/Admission';
import { AdmitCard } from '@/lib/models/AdmitCard';
import { Internship } from '@/lib/models/Internship';
import { Scholarship } from '@/lib/models/Scholarship';
import { Result } from '@/lib/models/Result';
import { PreviousYear } from '@/lib/models/PreviousYear';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

function generateUrls(section, items) {
  return items
    .map(({ slug }) => {
      return `
        <url>
          <loc>${siteUrl}/${section}/${slug}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    })
    .join('');
}

function generatePreviousYearUrls(previousYears) {
  // Generate URLs for individual papers: /papers/{subject}/{slug}
  const paperUrls = previousYears
    .map(({ subject, slug }) => {
      return `
        <url>
          <loc>${siteUrl}/papers/${encodeURIComponent(subject)}/${slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
    })
    .join('');

  // Generate URLs for subject listing pages: /papers/{subject}
  const uniqueSubjects = [...new Set(previousYears.map(item => item.subject))];
  const subjectUrls = uniqueSubjects
    .map((subject) => {
      return `
        <url>
          <loc>${siteUrl}/papers/${encodeURIComponent(subject)}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `;
    })
    .join('');

  return paperUrls + subjectUrls;
}

function generateSiteMap(allData) {
  // Define the order of sections based on importance
  const sectionOrder = ['govtjobs', 'jobs', 'results', 'internships', 'scholarships', 'admitcards', 'admissions'];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Sections in order of importance -->
      ${sectionOrder
        .map(section => {
          const items = allData[section];
          return items && items.length > 0 ? generateUrls(section, items) : '';
        })
        .join('')}
      
      <!-- Papers section -->
      <url>
        <loc>${siteUrl}/papers</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      
      <!-- Previous Year Papers URLs -->
      ${generatePreviousYearUrls(allData.previousYears)}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  await dbConnect();

  const [jobs, govtJobs, admissions, admitCards, internships, scholarships, results, previousYears] = await Promise.all([
    Job.find().select('slug'),
    GovtJob.find().select('slug'),
    Admission.find().select('slug'),
    AdmitCard.find().select('slug'),
    Internship.find().select('slug'),
    Scholarship.find().select('slug'),
    Result.find().select('slug'),
    PreviousYear.find().select('slug subject'), // Include subject field for PreviousYear
  ]);

  const allData = {
    jobs,
    govtjobs: govtJobs,
    admissions: admissions,
    admitcards: admitCards,
    internships: internships,
    scholarships: scholarships,
    results: results,
    previousYears: previousYears, // Keep the original key name
  };

  const sitemap = generateSiteMap(allData);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {}