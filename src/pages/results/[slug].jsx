// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import dbConnect from '@/lib/dbConnect';
// import { Result } from '@/lib/models/Result';
// import { FaExternalLinkAlt, FaLink, FaShareAlt } from 'react-icons/fa';
// import { NextSeo } from 'next-seo';
// import ShareModal from '@/modals/ShareModal';

// const ResultDetailsPage = ({ result, baseUrl }) => {
//   const router = useRouter();
//   const [showShare, setShowShare] = useState(false);

//   const shareDetails = [
//     result.organization && `Organization: ${result.organization}`,
//   ].filter(Boolean).join("\n");

//   const handleBack = () => router.push('/results');
//   const handleVisitResult = () => window.open(result?.importantLinks?.resultLink, '_blank');

//   if (!result) return <div className="max-w-6xl mx-auto p-6">No result found</div>;

//   return (
//     <>
//       <Head>
//         <title>{`${result.title} - Government Exam Results`}</title>
//         <meta 
//           name="description" 
//           content={`Latest updates for ${result.title} conducted by ${result.organization}. Check result dates, cutoff marks, and important links.`} 
//         />
//         <meta property="og:title" content={`${result.title} - Government Exam Results`} />
//         <meta 
//           property="og:description" 
//           content={`${result.title} results announced by ${result.organization}. View important dates and download marks.`} 
//         />
//         <meta property="og:image" content={`${baseUrl}/og-result-image.jpg`} />
//         <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
//         <meta name="twitter:card" content="summary_large_image" />
//         <link rel="canonical" href={`${baseUrl}${router.asPath}`} />
//       </Head>

//       <NextSeo
//               title={`${result.title || "Results Details"} | Exameets`}
//               description={result.description || "Results details"}
//               canonical={`https://www.exameets.in/results/${result.slug}`}
//               openGraph={{
//                 url: `https://www.exameets.in/results/${result.slug}`,
//                 title: `${result.title || "Results Details"} | Exameets`,
//                 description: result.description || "Results details",
//                           images: [
//                 {
//                   url: `https://www.exameets.in/api/og/result/${result.slug}`,
//                   width: 1200,
//                   height: 630,
//                   alt: `${result.title} at ${result.organization}`,
//                 },
//               ],
//               }}
//       />


//       <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
//         <div className="flex justify-between items-start mb-6">
//           <button 
//             onClick={handleBack}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//           >
//             ← Back to Results
//           </button>
//         </div>

//         <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col relative">
//           <button
//             className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//             onClick={() => setShowShare(true)}
//             aria-label="Share"
//           >
//             <FaShareAlt className="text-[#015990] dark:text-blue-400" size={22} />
//           </button>
          
//           <h1 className="text-2xl font-bold text-white text-center px-12">
//             {result.title || "Results Details"}
//           </h1>
          
//           <p className="mt-2 text-xl text-white text-center px-12">
//             {result.organization || "Not specified"}
//           </p>
//         </div>

//         <ShareModal
//           open={showShare}
//           onClose={() => setShowShare(false)}
//           url={`https://www.exameets.in${router.asPath}`}
//           title={result.title || "Government Job"}
//           details={shareDetails}
//         />

//         {/* Basic Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//           <div className="section-container">
//             <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Post Name</h3>
//             <p className="text-gray-700 dark:text-gray-300">{result.postName}</p>
//           </div>
//           <div className="section-container">
//             <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Total Vacancies</h3>
//             <p className="text-gray-700 dark:text-gray-300">{result.totalVacancies}</p>
//           </div>
//           <div className="section-container">
//             <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Exam Type</h3>
//             <p className="text-gray-700 dark:text-gray-300">{result.exam_type}</p>
//           </div>
//           <div className="section-container">
//             <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Result Date</h3>
//             <p className="text-gray-700 dark:text-gray-300">{result.resultDate}</p>
//           </div>
//         </div>

//         {/* Important Dates */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-800">
//                 <th className="px-4 py-2 text-center">Event</th>
//                 <th className="px-4 py-2 text-center">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {result.importantDates?.map((date, index) => (
//                 <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
//                   <td className="px-4 py-2 text-center">{date.event}</td>
//                   <td className="px-4 py-2 text-center">{date.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Cutoff Marks */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Cutoff Marks</h2>
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-100 dark:bg-gray-800">
//                 <th className="px-4 py-2 text-center">Category</th>
//                 <th className="px-4 py-2 text-center">Marks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {result.cutoffMarks?.map((cutoff, index) => (
//                 <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
//                   <td className="px-4 py-2 text-center">{cutoff.category}</td>
//                   <td className="px-4 py-2 text-center">{cutoff.marks}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Steps Sections */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Steps to Check Result</h3>
//               <ul className="list-disc pl-5 space-y-2">
//                 {result.stepsToCheckResult?.map((step, index) => (
//                   <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Next Steps</h3>
//               <ul className="list-disc pl-5 space-y-2">
//                 {result.nextSteps?.map((step, index) => (
//                   <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </section>

//         {/* Documents Required */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Required Documents</h2>
//           <ul className="list-disc pl-5 space-y-2">
//             {result.documentsRequired?.map((doc, index) => (
//               <li key={index} className="text-gray-700 dark:text-gray-300">{doc}</li>
//             ))}
//           </ul>
//         </section>

//         {/* Next Steps Description (from original Next.js) */}
//         {result.nextStepsDescription && (
//           <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//             <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Next Steps Description</h2>
//             <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.nextStepsDescription}</p>
//           </section>
//         )}

//         {/* SEO Section */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">SEO Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//               <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Slug</h3>
//               <p className="text-gray-700 dark:text-gray-300">{result.slug}</p>
//             </div>
//             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//               <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Search Description</h3>
//               <p className="text-gray-700 dark:text-gray-300">{result.searchDescription}</p>
//             </div>
//           </div>
//         </section>

//         {/* Important Links */}
//         <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
//           <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.entries(result.importantLinks || {}).map(([key, value]) => (
//               <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1')}
//                 </h3>
//                 {value ? (
//                   <a
//                     href={value}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
//                   >
//                     <FaLink /> Open Link
//                   </a>
//                 ) : (
//                   <span className="text-gray-500 dark:text-gray-400">N/A</span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* View Result Button */}
//         <div className="text-center mt-8">
//           <button
//             onClick={handleVisitResult}
//             className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
//             disabled={!result?.importantLinks?.resultLink}
//           >
//             <FaExternalLinkAlt /> View Official Result
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export const getServerSideProps = async (context) => {
//   await dbConnect();

//   const { slug } = context.params;
//   let baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   if (!baseUrl && context.req) {
//     const protocol = context.req.headers['x-forwarded-proto'] || 'http';
//     const host = context.req.headers.host || 'localhost:3000';
//     baseUrl = `${protocol}://${host}`;
//   }

//   try {
//     const result = await Result.findOne({ slug });

//     if (!result) {
//       return {
//         notFound: true
//       };
//     }

//     // Helper function to serialize MongoDB ObjectIds and dates
//     const serialize = (obj) => {
//       if (obj === null || typeof obj !== 'object') {
//         return obj;
//       }

//       if (obj instanceof Date) {
//         return obj.toISOString();
//       }

//       if (Array.isArray(obj)) {
//         return obj.map(serialize);
//       }

//       const serialized = {};
//       for (const [key, value] of Object.entries(obj)) {
//         if (key === '_id') {
//           serialized[key] = value.toString();
//         } else if (key === 'createdAt' || key === 'updatedAt') {
//           serialized[key] = value ? value.toISOString() : null;
//         } else if (value instanceof Date) {
//           serialized[key] = value.toISOString();
//         } else {
//           serialized[key] = serialize(value);
//         }
//       }
//       return serialized;
//     };

//     // Convert MongoDB document to plain JavaScript object
//     const plainResult = result.toObject();
    
//     // Serialize the result
//     const serializedResult = serialize(plainResult);

//     return {
//       props: {
//         result: serializedResult,
//         baseUrl: baseUrl || 'http://localhost:3000'
//       }
//     };
//   } catch (error) {
//     console.error('Database error:', error);
//     return {
//       notFound: true
//     };
//   }
// };

// export default ResultDetailsPage;

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dbConnect from '@/lib/dbConnect';
import { Result } from '@/lib/models/Result';
import { FaExternalLinkAlt, FaLink, FaShareAlt } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import { NextSeo } from 'next-seo';
import ShareModal from '@/modals/ShareModal';

const ResultDetailsPage = ({ result, baseUrl }) => {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);

  const shareDetails = [
    result.organization && `Organization: ${result.organization}`,
    result.postName && `Post: ${result.postName}`,
    result.totalVacancies && `Total Vacancies: ${result.totalVacancies}`,
  ].filter(Boolean).join("\n");

  const handleBack = () => router.push('/results');
  const handleVisitResult = () => {
    const resultLink = result?.importantLinks?.resultLink;
    if (resultLink) {
      window.open(resultLink, '_blank');
    }
  };

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!result) {
    return <div className="max-w-6xl mx-auto p-6">Result not found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <Head>
        <link rel="canonical" href={`${baseUrl}/results/${result.slug}`} />
        {/* Enhanced Result Event Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": result.title,
              "description": result.searchDescription || `${result.title} results announced by ${result.organization}. Check result dates, cutoff marks, and merit lists.`,
              "startDate": result.resultDate,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "organizer": {
                "@type": "Organization",
                "name": result.organization,
                "url": result.importantLinks?.officialWebsite
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
                "name": result.title,
                "educationalLevel": "higher education"
              },
              "subEvent": result.importantDates?.map(date => ({
                "@type": "Event",
                "name": `${result.title} - ${date.event}`,
                "startDate": date.date,
                "description": date.event
              })),
              "offers": {
                "@type": "Offer",
                "name": "Result Download",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock"
              },
              "potentialAction": {
                "@type": "DownloadAction",
                "name": "Download Result",
                "target": result.importantLinks?.resultLink
              },
              "url": `${baseUrl}/results/${result.slug}`
            })
          }}
        />
      </Head>

      <NextSeo
        title={`${result.title} | ${result.organization} | Exam Result Download`}
        description={result.searchDescription?.substring(0, 150) || `Download ${result.title} exam result. Result date: ${result.resultDate}. Get direct download link, cutoff marks, and merit lists.`}
        canonical={`${baseUrl}/results/${result.slug}`}
        openGraph={{
          url: `${baseUrl}/results/${result.slug}`,
          title: `${result.title} | ${result.organization} | Exam Result Download`,
          description: result.searchDescription?.substring(0, 150) || `Download ${result.title} exam result. Result date: ${result.resultDate}. Get direct download link, cutoff marks, and merit lists.`,
          images: [
            {
              url: `${baseUrl}/api/og/result/${result.slug}`,
              width: 1200,
              height: 630,
              alt: `${result.title} Exam Result`,
            },
          ],
          type: 'article',
          article: {
            publishedTime: result.createdAt,
            modifiedTime: result.updatedAt || result.createdAt,
            section: 'Exam Results',
            tags: [
              'exam result',
              'merit list',
              'cutoff marks',
              result.organization,
              ...(result.keywords || [])
            ]
          }
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              result.title,
              result.organization,
              result.postName,
              'exam result',
              'merit list',
              'cutoff marks',
              'result download',
              'government exam result',
              'competitive exam result',
              ...(result.keywords || [])
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
            name: 'result-date',
            content: result.resultDate
          },
          {
            name: 'organization',
            content: result.organization
          },
          {
            name: 'exam-type',
            content: result.exam_type
          }
        ]}
      />

      <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 inline-block" /> Back to Results
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
          <section className="border-gray-200 pb-3">
          <h1 className="text-xl font-bold text-white text-center">
            {result.title || "Results Details"}
          </h1>
          </section>

          <p className="mt-2 text-15px text-[#ececec] text-center">
            {result.organization || "Not specified"}
          </p>
        </div>

        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`https://www.exameets.in${router.asPath}`}
          title={result.title || "Government Job"}
          details={shareDetails}
        />

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Post Name</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.postName || 'Not specified'}</p>
          </div>
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Total Vacancies</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.totalVacancies || 'Not specified'}</p>
          </div>
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Exam Type</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.exam_type || 'Not specified'}</p>
          </div>
          <div className="section-container">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Result Date</h3>
            <p className="text-gray-700 dark:text-gray-300">{result.resultDate || 'Not specified'}</p>
          </div>
        </div>

        {/* Important Dates */}
        {result.importantDates?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
            <div className="space-y-3">
              {result.importantDates.map((date, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 dark:text-gray-200">{date.event}</p>
                  <p className="text-gray-700 dark:text-gray-300">{date.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cutoff Marks */}
        {result.cutoffMarks?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Cutoff Marks</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-center">Category</th>
                    <th className="px-4 py-2 text-center">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {result.cutoffMarks.map((cutoff, index) => (
                    <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 text-center">{cutoff.category}</td>
                      <td className="px-4 py-2 text-center">{cutoff.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Steps Sections */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.stepsToCheckResult?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Steps to Check Result</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {result.stepsToCheckResult.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.nextSteps?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Next Steps</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Documents Required */}
        {result.documentsRequired?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Required Documents</h2>
            <ul className="list-disc pl-5 space-y-2">
              {result.documentsRequired.map((doc, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{doc}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Next Steps Description */}
        {result.nextStepsDescription && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Next Steps Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.nextStepsDescription}</p>
          </section>
        )}

        {/* Important Links */}
        {result.importantLinks && Object.keys(result.importantLinks).length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.importantLinks || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </h3>
                  {value ? (
                    <a
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                    >
                      <FaLink /> Open Link
                    </a>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">N/A</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* View Result Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleVisitResult}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            disabled={!result?.importantLinks?.resultLink}
          >
            <FaExternalLinkAlt /> View Official Result
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  await dbConnect();

  const { slug } = context.params;
  const { req } = context;

  try {
    const result = await Result.findOne({ slug })
      .select('-createdAt -slug')
      .lean();

    if (!result) {
      return {
        notFound: true
      };
    }

    // Serialize data similar to admitcards
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) => {
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
        result: serializedResult,
        baseUrl: baseUrl || 'http://localhost:3000'
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      notFound: true
    };
  }
};

export default ResultDetailsPage;