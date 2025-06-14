import React from 'react';
import Head from 'next/head';
import dbConnect from '@/lib/dbConnect';
import { Result } from '@/lib/models/Result';
import Spinner from '@/components/Spinner';
import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/router';

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

const generateMetaDescription = (totalResults, searchKeyword) => {
  if (searchKeyword) {
    return `${totalResults} government exam results found for "${searchKeyword}". Check latest exam results, important dates, and cutoff marks.`;
  }
  return `Browse ${totalResults} government exam results. Latest updates on exam results, merit lists, and important dates for various government jobs.`;
};

const Results = ({ initialData, initialSearch, baseUrl }) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = React.useState(initialSearch || "");
  const debouncedSearchTerm = useDebounce(searchKeyword, 500);
  const { results, currentPage, totalPages, totalResults } = initialData;
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    if (debouncedSearchTerm !== initialSearch) {
      router.push({
        pathname: '/results',
        query: { 
          search: debouncedSearchTerm || undefined,
          page: 1 // Reset to first page on search
        }
      });
    }
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    // Refocus the search bar after the search operation completes
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

  if (router.isFallback) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Head>
        <title>{initialSearch ? `${initialSearch} Results` : 'Government Exam Results'} - Latest Updates</title>
        <meta 
          name="description" 
          content={generateMetaDescription(totalResults, initialSearch)} 
        />
        <meta property="og:title" content={`Government Exam Results - ${initialSearch || 'Latest Updates'}`} />
        <meta 
          property="og:description" 
          content={generateMetaDescription(totalResults, initialSearch)} 
        />
        <meta property="og:image" content={`${baseUrl}/og-results-image.jpg`} />
        <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${baseUrl}${router.asPath}`} />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": results.map((result, index) => ({
              "@type": "JobPosting",
              "position": index + 1,
              "name": result.title,
              "description": `${result.organization} - ${result.postName}`,
              "datePosted": result.createdAt,
              "validThrough": result.resultDate,
              "hiringOrganization": {
                "@type": "Organization",
                "name": result.organization
              },
              "jobLocation": {
                "@type": "Country",
                "name": "India"
              }
            }))
          })}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#003366] dark:text-white">
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
                className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
              >
                {/* Title Section */}
                <h2 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                  {result.title}
                </h2>
                
                {/* Organization with Border */}
                <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                  {result.organization}
                </div>
                
                {/* Content Section */}
                <div className="grid gap-2 mb-4">
                  {result.postName && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Post: {result.postName}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Result Date: {formatDate(result.resultDate)}
                  </div>
                </div>
                
                {/* Footer Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                    {result.totalVacancies} posts
                  </span>
                  <button
                    onClick={() => router.push(`/results/${result.slug}`)}
                    className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
                  >
                    View Details →
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
  );
};

export const getServerSideProps = async (context) => {
  await dbConnect();

  // Get query parameters
  const page = parseInt(context.query.page) || 1;
  const search = context.query.search || '';
  const limit = 8;
  const skip = (page - 1) * limit;

  // Build search query
  const query = {};
  if (search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { organization: { $regex: search.trim(), $options: 'i' } },
      { postName: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  try {
    const [results, totalResults] = await Promise.all([
      Result.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Result.countDocuments(query)
    ]);

    // Serialization helper
    const serialize = (obj) => JSON.parse(JSON.stringify(obj));

    return {
      props: {
        initialData: {
          results: results.map(serialize),
          currentPage: page,
          totalPages: Math.ceil(totalResults / limit),
          totalResults
        },
        initialSearch: search,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 
          `http://${context.req.headers.host}`
      }
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      notFound: true
    };
  }
};

export default Results;