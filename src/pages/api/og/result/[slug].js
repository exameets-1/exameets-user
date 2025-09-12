import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Provide base URL here
  const { pathname } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
  const slug = pathname.split('/').pop();

  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  // Fetch result data
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/results/${slug}`);
  if (!res.ok) {
    return new Response('Result not found', { status: 404 });
  }
  const data = await res.json();
  const result = data.result; // Use the result object from the response

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          backgroundImage: `url("https://www.exameets.in/images/og-images/results-og.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Text container positioned in the blue section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '600px', // Right half of the image (blue section)
            height: '100%',
            marginLeft: '525px', // Do not change this as this is the exact centre of the blue section 
            marginTop: '-60px', // 🔧 VERTICAL POSITION CONTROL: Negative = move up, Positive = move down
            padding: '40px',
            boxSizing: 'border-box',
          }}
        >
          {/* Result Title */}
          <h1
            style={{
              fontSize: '42px', // Reduced for better balance
              color: 'white',
              fontWeight: '800', // Extra bold for impact
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              lineHeight: '1.1', // Tighter line height for better spacing
              marginBottom: '24px', // Increased spacing
              textShadow: '4px 4px 12px rgba(0,0,0,0.8)', // Stronger shadow for better readability
              letterSpacing: '-0.03em', // Tighter letter spacing for modern look
              maxWidth: '500px',
              wordWrap: 'break-word',
              textAlign: 'center',
            }}
          >
            {result.title}
          </h1>
          
          {/* Separator Line after Title */}
          <div
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              marginBottom: '20px',
            }}
          />

          {/* Company and Location Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px', // Slightly increased for separator lines
              alignItems: 'center',
            }}
          >
            {/* Company Name */}
            <p
              style={{
                fontSize: '32px', // Larger for better hierarchy
                color: '#FFFFFF', // Pure white for better contrast
                fontWeight: '700', // Bold but not as heavy as title
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textShadow: '3px 3px 8px rgba(0,0,0,0.7)',
                margin: 0,
                letterSpacing: '-0.015em',
                textAlign: 'center',
              }}
            >
              {result.organization}
            </p>

            {/* Separator Line between Company and Location */}
            <div
              style={{
                width: '40px',
                height: '1px',
                backgroundColor: 'rgba(255,255,255,0.25)',
              }}
            />
            
            {/* State/Location */}
            <p
              style={{
                fontSize: '26px', // Slightly larger for better readability
                color: '#E1F5FE', // Light blue tint for subtle contrast
                fontWeight: '600',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
                margin: 0,
                letterSpacing: '-0.01em',
                textAlign: 'center',
              }}
            >
             {result.resultDate}
            </p>
          </div>
          
          {/* Accent Line */}
          <div
            style={{
              width: '100px', // Longer line for better visual impact
              height: '5px', // Slightly thicker
              backgroundColor: '#FF6B35', // More vibrant orange
              marginTop: '28px',
              borderRadius: '3px',
              boxShadow: '0 3px 8px rgba(255,107,53,0.4)', // Stronger glow effect
            }}
          />
        </div>
      </div>
    ),
    { 
      width: 1200, 
      height: 630,
    }
  );
}