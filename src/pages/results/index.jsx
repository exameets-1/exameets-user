// import React from 'react';
// import Head from 'next/head';
// import dbConnect from '@/lib/dbConnect';
// import { Result } from '@/lib/models/Result';
// import Loader from '@/components/Loader';
// import useDebounce from '@/hooks/useDebounce';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   try {
//     const date = new Date(dateString);
//     return isNaN(date) ? dateString : date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit'
//     });
//   } catch {
//     return dateString;
//   }
// };

// const generateMetaDescription = (totalResults, searchKeyword) => {
//   if (searchKeyword) {
//     return `${totalResults} government exam results found for "${searchKeyword}". Check latest exam results, important dates, and cutoff marks.`;
//   }
//   return `Browse ${totalResults} government exam results. Latest updates on exam results, merit lists, and important dates for various government jobs.`;
// };

// const Results = ({ initialData, initialSearch, baseUrl }) => {
//   const router = useRouter();
//   const [searchKeyword, setSearchKeyword] = React.useState(initialSearch || "");
//   const debouncedSearchTerm = useDebounce(searchKeyword, 500);
//   const { results, currentPage, totalPages, totalResults } = initialData;
//   const searchInputRef = React.useRef(null);

//   React.useEffect(() => {
//     if (debouncedSearchTerm !== initialSearch) {
//       router.push({
//         pathname: '/results',
//         query: { 
//           search: debouncedSearchTerm || undefined,
//           page: 1 // Reset to first page on search
//         }
//       });
//     }
//   }, [debouncedSearchTerm]);

//   React.useEffect(() => {
//     // Refocus the search bar after the search operation completes
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [results]);

//   const handleSearch = (e) => {
//     setSearchKeyword(e.target.value);
//   };

//   const handlePageChange = (newPage) => {
//     router.push({
//       pathname: '/results',
//       query: { 
//         search: initialSearch,
//         page: newPage
//       }
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   if (router.isFallback) return <Loader />;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//       <Head>
//         <title>{initialSearch ? `${initialSearch} Results` : 'Government Exam Results'} - Latest Updates</title>
//         <meta 
//           name="description" 
//           content={generateMetaDescription(totalResults, initialSearch)} 
//         />
//         <meta property="og:title" content={`Government Exam Results - ${initialSearch || 'Latest Updates'}`} />
//         <meta 
//           property="og:description" 
//           content={generateMetaDescription(totalResults, initialSearch)} 
//         />
//         <meta property="og:image" content={`${baseUrl}/og-results-image.jpg`} />
//         <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
//         <meta name="twitter:card" content="summary_large_image" />
//         <link rel="canonical" href={`${baseUrl}${router.asPath}`} />

//         {/* Schema.org structured data */}
//         <script type="application/ld+json">
// {JSON.stringify({
//   "@context": "https://schema.org",
//   "@type": "SearchResultsPage",
//   "mainEntity": {
//     "@type": "ItemList",
//     "itemListElement": results.map((result, index) => ({
//       "@type": "ListItem",
//       "position": index + 1,
//       // IMPORTANT: point to the actual detail page for each result
//       "url": `https://www.exameets.in/results/${result.slug}`,
//       "name": result.title
//     }))
//   }
// })}
// </script>

//       </Head>

//       <div className="max-w-7xl mx-auto">
//         <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-[#003366] dark:text-white">
//               {initialSearch ? `Search Results for "${initialSearch}"` : 'Latest Government Exam Results'}
//             </h1>
//           </div>

//           <div className="flex flex-col md:flex-row gap-4 mb-6">
//             <div className="flex-1">
//               <input
//                 id="results-search"
//                 name="results-search"
//                 type="text"
//                 placeholder="Search results by title, organization or post..."
//                 value={searchKeyword}
//                 onChange={handleSearch}
//                 ref={searchInputRef}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//           {results.length === 0 ? (
//             <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
//               No results found{initialSearch && ` for "${initialSearch}"`}. Try adjusting your search term.
//             </div>
//           ) : (
//             results.map((result) => (
//               <div 
//                 key={result._id}
//                 className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-md hover:shadow-blue-250 dark:hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 ease-in-out relative h-full"
//               >
//                 <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] overflow-hidden">
//                   {result.title}
//                 </h3>
//                 <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-2 overflow-hidden break-words">
//                   {result.organization}
//                 </div>
//                 <div className="grid gap-2 mb-4 overflow-hidden">
//                   {result.postName && (
//                     <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
//                       <span className="font-bold">Post:</span> {result.postName}
//                     </div>
//                   )}
//                   {result.resultDate && (
//                     <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
//                       <span className="font-bold">Result Date:</span> {formatDate(result.resultDate)}
//                     </div>
//                   )}
//                   {result.exam_type && (
//                     <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
//                       <span className="font-bold">Exam Type:</span> {result.exam_type}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
//                   <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
//                     {result.totalVacancies ? `${result.totalVacancies} posts` : 'General'}
//                   </span>
//                   <Link 
//                     href={`/results/${result.slug}`}
//                     className="text-[#015990] dark:text-blue-400 font-bold hover:underline whitespace-nowrap ml-2 flex-shrink-0"
//                   >
//                     View Details →
//                   </Link>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 my-8">
//             <button
//               className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
//                 currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
//               }`}
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
            
//             <div className="text-gray-600 dark:text-gray-300">
//               Page {currentPage} of {totalPages}
//             </div>

//             <button
//               className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
//                 currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
//               }`}
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const getServerSideProps = async (context) => {
//   await dbConnect();

//   // Get query parameters
//   const page = parseInt(context.query.page) || 1;
//   const search = context.query.search || '';
//   const limit = 8;
//   const skip = (page - 1) * limit;

//   // Build search query
//   const query = {};
//   if (search.trim()) {
//     query.$or = [
//       { title: { $regex: search.trim(), $options: 'i' } },
//       { organization: { $regex: search.trim(), $options: 'i' } },
//       { postName: { $regex: search.trim(), $options: 'i' } }
//     ];
//   }

//   try {
//     const [results, totalResults] = await Promise.all([
//       Result.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Result.countDocuments(query)
//     ]);

//     // Serialization helper
//     const serialize = (obj) => JSON.parse(JSON.stringify(obj));

//     return {
//       props: {
//         initialData: {
//           results: results.map(serialize),
//           currentPage: page,
//           totalPages: Math.ceil(totalResults / limit),
//           totalResults
//         },
//         initialSearch: search,
//         baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 
//           `http://${context.req.headers.host}`
//       }
//     };
//   } catch (error) {
//     console.error('Error fetching results:', error);
//     return {
//       notFound: true
//     };
//   }
// };

// export default Results;

import React from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import dbConnect from '@/lib/dbConnect';
import { Result } from '@/lib/models/Result';
import Loader from '@/components/Loader';
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/router';
import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Enhanced meta description generation
const generateMetaDescription = (searchKeyword, totalResults = 0) => {
  if (totalResults === 0) {
    return "No exam results found. Browse latest government exam results, merit lists, and cutoff marks for competitive exams across India on Exameets.";
  }
  let description = `Download ${totalResults} government exam results`;
  if (searchKeyword) description = `${totalResults} ${searchKeyword} exam results available for download`;
  return description + `. Get result dates, cutoff marks, merit lists, and important instructions on Exameets.`;
};

// Enhanced schema generation for results listing
const generateResultListingSchema = (results, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": results.map((result, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/results/${result.slug}`,
        "name": result.title,
        "item": {
          "@type": "Event",
          "@id": `${baseUrl}/results/${result.slug}`,
          "name": result.title,
          "description": result.searchDescription,
          "startDate": result.resultDate,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "organizer": {
            "@type": "Organization",
            "name": result.organization
          },
          "about": {
            "@type": "ExaminationEvent",
            "name": result.title,
            "educationalLevel": "higher education"
          },
          "offers": {
            "@type": "Offer",
            "name": "Result Download",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    }
  };
};

const sanitizeJSON = (data) => {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
};

const Results = ({ initialData, initialSearch, baseUrl, totalResults = 0 }) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = React.useState(initialSearch || "");
  const debouncedSearchTerm = useDebounce(searchKeyword, 500);
  const { results, currentPage, totalPages } = initialData;
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    if (debouncedSearchTerm !== initialSearch) {
      router.push({
        pathname: '/results',
        query: { 
          search: debouncedSearchTerm || undefined,
          page: 1
        }
      });
    }
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [results]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handlePageChange = (newPage) => {
    router.push({
      pathname: '/results',
      query: { 
        search: initialSearch,
        page: newPage
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (router.isFallback) return <Loader />;

  return (
    <>
      <Head>
        <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJSON(generateResultListingSchema(results || [], baseUrl))
          }}
        />
        <link rel="canonical" href={`${baseUrl}/results`} />
      </Head>

      <NextSeo
        canonical={`${baseUrl}/results`}
        title={`${initialSearch ? `${initialSearch} Results` : 'Latest Government Exam Results & Merit Lists'} | Exameets`}
        description={generateMetaDescription(initialSearch, totalResults)}
        openGraph={{
          url: `${baseUrl}/results`,
          title: `${initialSearch ? `${initialSearch} Results` : 'Latest Government Exam Results & Merit Lists'} | Exameets`,
          description: generateMetaDescription(initialSearch, totalResults),
          images: [
            {
              url: `${baseUrl}/api/og/results`,
              width: 1200,
              height: 630,
              alt: 'Government Exam Results and Merit Lists on Exameets',
            }
          ],
          type: 'website'
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              'exam results',
              'merit list',
              'government exam results',
              'competitive exam results',
              'cutoff marks',
              'result date',
              'exam merit list',
              ...(initialSearch ? [initialSearch] : [])
            ].join(', ')
          },
          {
            name: 'author',
            content: 'Exameets'
          },
          {
            property: 'article:author',
            content: 'Exameets'
          }
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#e6f4ff] dark:bg-gray-800 p-1.5 rounded-lg mb-8">
            <div className="mb-2">
              <h1 className="text-3xl ml-2 font-bold text-[#003366] dark:text-white">
                {initialSearch ? `Search Results for "${initialSearch}"` : 'Latest Government Exam Results'}
              </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  id="results-search"
                  name="results-search"
                  type="text"
                  placeholder="Search results by title, organization or post..."
                  value={searchKeyword}
                  onChange={handleSearch}
                  ref={searchInputRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                No results found{initialSearch && ` for "${initialSearch}"`}. Try adjusting your search term.
              </div>
            ) : (
              results.map((result) => (
                <div 
                  key={result._id}
                  className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-md hover:shadow-blue-250 dark:hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 ease-in-out relative h-full"
                >
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] overflow-hidden">
                    {result.title}
                  </h3>
                  <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-2 overflow-hidden break-words">
                    {result.organization}
                  </div>
                  <div className="grid gap-2 mb-4 overflow-hidden">
                    {result.postName && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
                        <span className="font-bold">Post:</span> {result.postName}
                      </div>
                    )}
                    {result.resultDate && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
                        <span className="font-bold">Result Date:</span> {formatDate(result.resultDate)}
                      </div>
                    )}
                    {result.exam_type && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
                        <span className="font-bold">Exam Type:</span> {result.exam_type}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {result.totalVacancies ? `${result.totalVacancies} posts` : 'General'}
                    </span>
                    <Link 
                      href={`/results/${result.slug}`}
                      className="text-[#015990] dark:text-blue-400 font-bold hover:underline whitespace-nowrap ml-2 flex-shrink-0"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 my-8">
              <button
                className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>

              <button
                className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  await dbConnect();
  const { query, req } = context;

  const page = parseInt(query.page) || 1;
  const search = query.search || '';
  const limit = 8;
  const skip = (page - 1) * limit;

  // Build search query
  const dbQuery = {};
  if (search.trim()) {
    dbQuery.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { organization: { $regex: search.trim(), $options: 'i' } },
      { postName: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  try {
    const [results, totalResults] = await Promise.all([
      Result.find(dbQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments(dbQuery)
    ]);

    // Properly serialize data similar to admitcards
    const serializedResults = results.map(result => ({
      ...result,
      _id: result._id.toString(),
      postedBy: result.postedBy?._id ? result.postedBy._id.toString() : null,
      createdAt: result.createdAt instanceof Date 
        ? result.createdAt.toISOString() 
        : result.createdAt,
      importantDates: result.importantDates?.map(date => {
        const newDate = { ...date };
        if (date._id) {
          newDate._id = date._id.toString();
        } else {
          delete newDate._id;
        }
        return newDate;
      }),
      cutoffMarks: result.cutoffMarks?.map(cutoff => {
        const newCutoff = { ...cutoff };
        if (cutoff._id) {
          newCutoff._id = cutoff._id.toString();
        } else {
          delete newCutoff._id;
        }
        return newCutoff;
      })
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
        initialData: {
          results: serializedResults,
          currentPage: page,
          totalPages: Math.ceil(totalResults / limit),
          totalResults
        },
        initialSearch: search,
        baseUrl: baseUrl || 'http://localhost:3000',
        totalResults // Add this line
      }
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      props: {
        initialData: {
          results: [],
          currentPage: 1,
          totalPages: 0,
          totalResults: 0
        },
        initialSearch: '',
        baseUrl: 'http://localhost:3000',
        totalResults: 0
      }
    };
  }
};

export default Results;