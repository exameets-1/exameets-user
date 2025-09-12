import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split('/').pop();

  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  // Fetch job data from Node.js API
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs/${slug}`);
  if (!res.ok) {
    return new Response('Job not found', { status: 404 });
  }
  const job = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url("https://exameets.in/images/og-images/jobs-og.png")`,
          backgroundSize: 'cover',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 60,
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          {job.jobTitle}
        </h1>
        <p
          style={{
            fontSize: 36,
            color: 'white',
            marginTop: 20,
            textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          {job.companyName}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
