import React from 'react';
import Head from 'next/head';
import dbConnect from '@/lib/dbConnect';
import { AdmitCard } from '@/lib/models/AdmitCard';
import { useRouter } from 'next/router';
import { FaExternalLinkAlt, FaLink, FaShareAlt } from 'react-icons/fa';
import { NextSeo } from 'next-seo';
import ShareModal from '@/modals/ShareModal';

const AdmitCardDetailsPage = ({ admitCard, baseUrl }) => {
  const router = useRouter();
  const [showShare, setShowShare] = React.useState(false);

  const shareDetails = [
    admitCard.organization && `Organization: ${admitCard.organization}`,
    admitCard.vacancies && `Vacancies: ${admitCard.vacancies}`,
  ].filter(Boolean).join("\n");

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!admitCard) {
    return <div className="max-w-6xl mx-auto p-6">Admit card not found</div>;
  }

  const handleBack = () => router.push('/admitcards');
  
  const handleVisitAdmitCard = () => {
    const downloadLink = admitCard.importantLinks?.find(link => link.linkType === 'downloadLink');
    if (downloadLink) {
      window.open(downloadLink.link, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <Head>
        <link rel="canonical" href={`${baseUrl}/admitcards/${admitCard.slug}`} />
        {/* Enhanced Admit Card Event Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": admitCard.title,
              "description": admitCard.searchDescription,
              "startDate": admitCard.examDetails?.[0]?.examDate,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "organizer": {
                "@type": "Organization",
                "name": admitCard.organization,
                "url": admitCard.officialWebsite
              },
              "location": {
                "@type": "Place",
                "name": "Multiple Centers",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "IN"
                }
              },
              "about": {
                "@type": "ExaminationEvent",
                "name": admitCard.title,
                "educationalLevel": "higher education"
              },
              "subEvent": admitCard.examDetails?.map(detail => ({
                "@type": "Event",
                "name": `${admitCard.title} - ${detail.examDate}`,
                "startDate": detail.examDate,
                "startTime": detail.reportingTime,
                "description": `Shift timings: ${detail.shiftTimings}`
              })),
              "offers": {
                "@type": "Offer",
                "name": "Admit Card Download",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              },
              "potentialAction": {
                "@type": "DownloadAction",
                "name": "Download Admit Card",
                "target": admitCard.importantLinks?.find(link => link.linkType === 'downloadLink')?.link
              },
              "url": `${baseUrl}/admitcards/${admitCard.slug}`
            })
          }}
        />
      </Head>

      <NextSeo
        title={`${admitCard.title} | ${admitCard.organization} | Admit Card Download`}
        description={admitCard.searchDescription?.substring(0, 150) || `Download ${admitCard.title} admit card. Exam date: ${admitCard.examDetails?.[0]?.examDate}. Get direct download link and important instructions.`}
        canonical={`${baseUrl}/admitcards/${admitCard.slug}`}
        openGraph={{
          url: `${baseUrl}/admitcards/${admitCard.slug}`,
          title: `${admitCard.title} | ${admitCard.organization} | Admit Card Download`,
          description: admitCard.searchDescription?.substring(0, 150) || `Download ${admitCard.title} admit card. Exam date: ${admitCard.examDetails?.[0]?.examDate}. Get direct download link and important instructions.`,
          images: [
            {
              url: `${baseUrl}/api/og/admitcard/${admitCard.slug}`,
              width: 1200,
              height: 630,
              alt: `${admitCard.title} Admit Card`,
            },
          ],
          type: 'article',
          article: {
            publishedTime: admitCard.createdAt,
            modifiedTime: admitCard.updatedAt || admitCard.createdAt,
            section: 'Admit Cards',
            tags: [
              'admit card',
              'hall ticket',
              admitCard.organization,
              ...(admitCard.keywords || [])
            ]
          }
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              admitCard.title,
              admitCard.organization,
              'admit card',
              'hall ticket',
              'exam admit card',
              'recruitment hall ticket',
              'download admit card',
              ...(admitCard.keywords || [])
            ].filter(Boolean).join(', ')
          },
          {
            name: 'author',
            content: 'Exameets'
          },
          {
            property: 'article:author',
            content: 'Exameets'
          },
          {
            name: 'exam-date',
            content: admitCard.examDetails?.[0]?.examDate
          },
          {
            name: 'organization',
            content: admitCard.organization
          }
        ]}
      />

      <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Admit Cards
          </button>
          <button
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setShowShare(true)}
            aria-label="Share"
          >
            <FaShareAlt className="text-[#015990] dark:text-blue-400" size={22} />
          </button>
        </div>

        <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col relative">
        <section className="border-b border-gray-200 pb-3">
          <h1 className="text-xl font-bold text-white text-center">
            {admitCard.title || "Admit Card Details"}
          </h1>
        </section>

          <p className="mt-2 text-15px text-[#ececec] text-center">
            {admitCard.organization || "Not specified"}
          </p>
        </div>

        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`https://www.exameets.in${router.asPath}`}
          title={admitCard.title || "Admit Card Details"}
          details={shareDetails}
        />

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Advertisement Number</h3>
            <p className="text-gray-700 dark:text-gray-300">{admitCard.advertisementNumber}</p>
          </div>
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Vacancies</h3>
            <p className="text-gray-700 dark:text-gray-300">{admitCard.vacancies}</p>
          </div>
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Official Website</h3>
            <a 
              href={admitCard.officialWebsite} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {admitCard.officialWebsite}
            </a>
          </div>
        </div>

        {/* Important Dates */}
        {admitCard.importantDates?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
            <div className="space-y-3">
              {admitCard.importantDates.map((date, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 dark:text-gray-200">{date.event}</p>
                  <p className="text-gray-700 dark:text-gray-300">{date.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Exam Details */}
        {admitCard.examDetails?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Exam Details</h2>
            <div className="space-y-3">
              {admitCard.examDetails.map((detail, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 dark:text-gray-200">Exam Date: {detail.examDate}</p>
                  <p className="text-gray-700 dark:text-gray-300">Shift Timings: {detail.shiftTimings}</p>
                  <p className="text-gray-700 dark:text-gray-300">Reporting Time: {detail.reportingTime}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Steps Sections */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {admitCard.downloadSteps?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Download Steps</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {admitCard.downloadSteps.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ul>
              </div>
            )}
            {admitCard.instructions?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Instructions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {admitCard.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Important Links */}
        {admitCard.importantLinks?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admitCard.importantLinks.map((link, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <a
                    href={link.link.startsWith("http") ? link.link : `https://${link.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                  >
                    <FaLink /> {link.linkType}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Download Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleVisitAdmitCard}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            disabled={!admitCard.importantLinks?.some(link => link.linkType === 'downloadLink')}
          >
            <FaExternalLinkAlt /> Download Admit Card
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();
  const { params, req } = context;
  const slug = params.slug;

  try {
    const admitCard = await AdmitCard.findOne({ slug })
      .select('-createdAt -slug')
      .lean();

    if (!admitCard) {
      return {
        notFound: true
      };
    }

    // Serialize data
    const serializedAdmitCard = JSON.parse(JSON.stringify(admitCard, (key, value) => {
      return key === '_id' ? value.toString() : value;
    }));

    // Generate canonical URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl && req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      baseUrl = `${protocol}://${host}`;
    }

    return {
      props: {
        admitCard: serializedAdmitCard,
        baseUrl: baseUrl || 'http://localhost:3000'
      }
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      notFound: true
    };
  }
}

export default AdmitCardDetailsPage;