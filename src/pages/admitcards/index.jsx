import { NextSeo } from 'next-seo';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import dbConnect from '@/lib/dbConnect';
import { AdmitCard } from '@/lib/models/AdmitCard';
import { ArrowRight } from 'lucide-react';

// Add these helper functions before the component
const generateMetaDescription = (searchKeyword, totalAdmitCards = 0) => {
  if (totalAdmitCards === 0) {
    return "No admit cards found. Browse latest admit cards and hall tickets for competitive exams across India on Exameets.";
  }
  let description = `Download ${totalAdmitCards} admit cards and hall tickets`;
  if (searchKeyword) description = `${totalAdmitCards} ${searchKeyword} admit cards available for download`;
  return description + `. Get direct download links, exam dates, and important instructions on Exameets.`;
};

const generateAdmitCardListingSchema = (admitCards, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": admitCards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/admitcards/${card.slug}`,
        "name": card.title,
        "item": {
          "@type": "Event",
          "@id": `${baseUrl}/admitcards/${card.slug}`,
          "name": card.title,
          "description": card.searchDescription,
          "startDate": card.examDetails?.[0]?.examDate,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "organizer": {
            "@type": "Organization",
            "name": card.organization
          },
          "about": {
            "@type": "ExaminationEvent",
            "name": card.title,
            "educationalLevel": "higher education"
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

// Update the component props to include totalAdmitCards
const AdmitCards = ({ admitCards, totalPages, currentPage, initialSearch, baseUrl, totalAdmitCards = 0 }) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Create memoized debounced handler
  const debouncedSearch = useCallback(
    debounce((term) => {
      router.push({
        pathname: '/admitcards',
        query: { q: term, page: 1 }
      });
    }, 500), // 500ms delay
    [router]
  );

  // Effect to handle the debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== initialSearch) {
      debouncedSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, initialSearch, debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setDebouncedSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    router.push({
      pathname: '/admitcards',
      query: { ...router.query, page: newPage }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword !== debouncedSearchTerm) {
      router.push({
        pathname: '/admitcards',
        query: { q: searchKeyword, page: 1 }
      });
    }
  };

  const handleViewDetails = (admitCardSlug) => {
    router.push(`/admitcards/${admitCardSlug}`);
  };

  return (
    <>
      <Head>
        <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJSON(generateAdmitCardListingSchema(admitCards || [], baseUrl))
          }}
        />
        <title>Admit Cards | Exameets</title>
        <meta
          name="description"
          content="Find latest admit cards and recruitment hall tickets for government jobs and competitive exams. Get direct download links and important exam dates."
        />
        <link rel="canonical" href={`https://www.exameets.in/admitcards`} />
      </Head>

      <NextSeo
        canonical={`${baseUrl}/admitcards`}
        title={`${searchKeyword ? `${searchKeyword} Admit Cards` : 'Latest Admit Cards & Hall Tickets'} | Exameets`}
        description={generateMetaDescription(searchKeyword, totalAdmitCards)}
        openGraph={{
          url: `${baseUrl}/admitcards`,
          title: `${searchKeyword ? `${searchKeyword} Admit Cards` : 'Latest Admit Cards & Hall Tickets'} | Exameets`,
          description: generateMetaDescription(searchKeyword, totalAdmitCards),
          images: [
            {
              url: `${baseUrl}/api/og/admitcards`,
              width: 1200,
              height: 630,
              alt: 'Admit Cards and Hall Tickets on Exameets',
            }
          ],
          type: 'website'
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              'admit card',
              'hall ticket',
              'exam admit card',
              'recruitment hall ticket',
              'competitive exam admit card',
              'government exam hall ticket',
              ...(searchKeyword ? [searchKeyword] : [])
            ].join(', ')
          }
        ]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#e6f4ff] dark:bg-gray-800 p-1.5 rounded-lg mb-8">
            <div className="mb-2">
              <h1 className="text-3xl ml-2 font-bold text-[#003366] dark:text-white">
                Latest Admit Cards
              </h1>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  id="admitcards-search"
                  name="admitcards-search"
                  type="text"
                  placeholder="Search admit cards..."
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {admitCards.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                No admit cards found matching your criteria. Try adjusting your filters or search term.
              </div>
            ) : (
              admitCards.map((admitCard) => (
                <div 
                  key={admitCard._id} 
                  className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
                >
                  {/* Title Section */}
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {admitCard.title}
                  </h3>
                  {/* Organization with Border */}
                  <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                    {admitCard.organization}
                  </div>

                  {/* Exam Date */}
                  {/* <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-bold">Exam Date:</span> {admitCard.examDate || 'Not specified'}
                  </div> */}

                  {/* Content Section */}
                  <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                     <span className="font-bold">Exam Date:</span> {admitCard.examDetails?.[0]?.examDate || 'Not available'}
                    </div>
                  </div>

                  {/* Vacancies
                  <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                     <span className="font-bold">Vacancies :</span> {admitCard.vacancies || 'Not available'}
                    </div>
                  </div> */}
                  {/* Footer Section */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                      Vacancies : {admitCard.vacancies || 'Not available'}
                    </span>
                    <button
                      className="text-[#015990] dark:text-blue-400 font-bold hover:underline"
                      onClick={() => handleViewDetails(admitCard.slug)}
                    >
                      View Details <ArrowRight className="w-4 h-4 inline-block mb-1" />
                    </button>
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

export async function getServerSideProps(context) {
  await dbConnect();
  const { query, req } = context;
  
  const page = parseInt(query.page) || 1;
  const limit = 8;
  const searchKeyword = query.q || '';

  const dbQuery = {};
  if (searchKeyword) {
    dbQuery.$or = [
      { title: { $regex: searchKeyword, $options: 'i' } },
      { organization: { $regex: searchKeyword, $options: 'i' } },
    ];
  }

  try {
    const total = await AdmitCard.countDocuments(dbQuery);
    const admitCards = await AdmitCard.find(dbQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  
    // Properly serialize data
    const serializedAdmitCards = admitCards.map(card => ({
      ...card,
      _id: card._id.toString(),
      postedBy: card.postedBy?._id ? card.postedBy._id.toString() : null,
      createdAt: card.createdAt instanceof Date 
        ? card.createdAt.toISOString() 
        : card.createdAt,
      importantDates: card.importantDates?.map(date => {
        const newDate = { ...date };
        if (date._id) {
          newDate._id = date._id.toString();
        } else {
          delete newDate._id;
        }
        return newDate;
      }),
      examDetails: card.examDetails?.map(detail => {
        const newDetail = { ...detail };
        if (detail._id) {
          newDetail._id = detail._id.toString();
        } else {
          delete newDetail._id;
        }
        return newDetail;
      }),
      importantLinks: card.importantLinks?.map(link => {
        const newLink = { ...link };
        if (link._id) {
          newLink._id = link._id.toString();
        } else {
          delete newLink._id;
        }
        return newLink;
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
        admitCards: serializedAdmitCards,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        initialSearch: searchKeyword,
        baseUrl: baseUrl || 'http://localhost:3000',
        totalAdmitCards: total // Add this line
      }
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      props: {
        admitCards: [],
        totalPages: 0,
        currentPage: 1,
        initialSearch: '',
        baseUrl: 'http://localhost:3000',
        totalAdmitCards: 0 // Add this line
      }
    };
  }
}

export default AdmitCards;