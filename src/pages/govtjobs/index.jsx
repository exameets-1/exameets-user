import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import dbConnect from '@/lib/dbConnect';
import { GovtJob } from '@/lib/models/GovtJob';
import useDebounce from '@/hooks/useDebounce'; // Create this hook or use a utility
import Link from 'next/link';
import Head from 'next/head';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    // Handle DD-MM-YYYY format from MongoDB
    if (typeof dateString === 'string' && dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Input is already in DD-MM-YYYY format, just return it
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${day}-${month}-${year}`;
      }
    }
    
    // Fallback for other date formats (convert to DD-MM-YYYY)
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

const GovtJobsPage = ({ govtJobs, currentPage, totalPages, totalJobs, error }) => {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState(router.query.searchKeyword || '');
  const debouncedSearchTerm = useDebounce(searchKeyword, 500);
  const searchInputRef = useRef(null);

  // Sync search keyword with query parameter
  useEffect(() => {
    if (debouncedSearchTerm !== router.query.searchKeyword) {
      const query = { ...router.query };
      if (debouncedSearchTerm) {
        query.searchKeyword = debouncedSearchTerm;
      } else {
        delete query.searchKeyword;
      }
      query.page = 1;
      router.push({ pathname: router.pathname, query }).then(() => {
        // Refocus the search bar after the search operation completes
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    }
  }, [debouncedSearchTerm]);

  // Update local state when query changes
  useEffect(() => {
    setSearchKeyword(router.query.searchKeyword || '');
  }, [router.query.searchKeyword]);

  const handleFilterChange = (filterType, value) => {
    const query = { ...router.query };
    query[filterType] = value;
    query.page = 1;
    router.push({ pathname: router.pathname, query });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push({ 
        pathname: router.pathname,
        query: { ...router.query, page: newPage }
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">Error: {error}</div>;
  }

  return (
    <>
      <Head>
        <title>Government Jobs | Exameets</title>
        <meta name="description" content="Find the latest government job listings in India on Exameets. Stay updated with job alerts and resources to help you succeed." />
        <link rel="canonical" href={`https://exameets.in/govtjobs`} />
      </Head>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#003366] dark:text-white">Government Jobs</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  id="govtjobs-search"
                  name="govtjobs-search"
                  type="text"
                  placeholder="Search jobs..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  ref={searchInputRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                id="govtjobs-location"
                name="govtjobs-location"
                value={router.query.location || 'All'}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Cities</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
              </select>
              <select
                id="govtjobs-sort"
                name="govtjobs-sort"
                value={router.query.sort || 'All'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">Sort by</option>
                <option value="recent">Recent First</option>
                <option value="deadline">Nearest Deadline</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {govtJobs.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
              No items found matching your criteria. Try adjusting your filters or search term.
            </div>
          ) : (
            govtJobs.map((job) => (
              <div 
                key={job._id} 
                className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-md hover:shadow-blue-250 dark:hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 ease-in-out relative h-full"
              >
                <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] overflow-hidden">
                  {job.jobTitle}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-2 overflow-hidden break-words">
                  {job.organization}
                </div>
                <div className="grid gap-2 mb-4 overflow-hidden">
                  {job.jobLocation && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
                      <span className="font-medium">Location:</span> {job.jobLocation}
                    </div>
                  )}
                  {job.postNames && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
                      <span className="font-medium">Post:</span> {Array.isArray(job.postNames) ? job.postNames.join(', ') : job.postNames}
                    </div>
                  )}
                  {job.educationalQualifications && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
                      <span className="font-medium">Qualification:</span> {Array.isArray(job.educationalQualifications) ? job.educationalQualifications[0] : job.educationalQualifications}
                    </div>
                  )}
                  {job.applicationStartDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
                      <span className="font-medium">Start:</span> {job.applicationStartDate}
                    </div>
                  )}
                  {job.applicationEndDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
                      <span className="font-medium">Close:</span> {job.applicationEndDate}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                    {job.totalVacancies ? `${job.totalVacancies} posts` : 'General'}
                  </span>
                  <Link 
                    href={`/govtjobs/${job.slug}`}
                    className="text-[#015990] dark:text-blue-400 font-medium hover:underline whitespace-nowrap ml-2 flex-shrink-0"
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
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
  try {
    const { query } = context;
    const { location, sort, searchKeyword, page = 1, limit = 8 } = query;

    // Build query
    const dbQuery = {};
    if (location && location !== 'All') {
      dbQuery.jobLocation = { $regex: location, $options: 'i' };
    }

    if (searchKeyword && searchKeyword.trim()) {
      const searchTerm = searchKeyword.trim();
      
      // Use regex search for partial matches (better for user experience)
      dbQuery.$or = [
        { jobTitle: { $regex: searchTerm, $options: 'i' } },
        { organization: { $regex: searchTerm, $options: 'i' } },
        { jobOverview: { $regex: searchTerm, $options: 'i' } },
        { 'postNames': { $regex: searchTerm, $options: 'i' } },
        { 'keywords': { $regex: searchTerm, $options: 'i' } },
        { 'educationalQualifications': { $regex: searchTerm, $options: 'i' } },
        { 'additionalRequirements': { $regex: searchTerm, $options: 'i' } },
        { 'selectionProcess': { $regex: searchTerm, $options: 'i' } },
        { 'examSubjects': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Sort options - default to createdAt descending
    let sortOptions = { createdAt: -1 }; // Default sort by newest first
    if (sort === 'recent') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'deadline') {
      sortOptions = { applicationEndDate: 1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute queries
    const totalJobs = await GovtJob.countDocuments(dbQuery);    
    const govtJobs = await GovtJob.find(dbQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    // Format dates and convert all ObjectIds to strings
    const formattedJobs = govtJobs.map(job => ({
      ...job,
      _id: job._id.toString(),
      applicationStartDate: job.applicationStartDate ,
      applicationEndDate: job.applicationEndDate ,
      notificationReleaseDate: job.notificationReleaseDate ,
      examInterviewDate: job.examInterviewDate ,
      createdAt: job.createdAt ? job.createdAt.toString() : null,
      updatedAt: job.updatedAt ? job.updatedAt.toString() : null,
      postedBy: job.postedBy ? job.postedBy.toString() : null,
      faq: job.faq?.map(faqItem => ({
        ...faqItem,
        _id: faqItem._id ? faqItem._id.toString() : null
      })) || []
    }));

    return {
      props: {
        govtJobs: formattedJobs,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalJobs / parseInt(limit)),
        totalJobs,
      },
    };
  } catch (error) {
    console.error('Error fetching government jobs:', error);
    return {
      props: {
        error: error.message || 'Failed to load government jobs',
        govtJobs: [],
        currentPage: 1,
        totalPages: 0,
        totalJobs: 0,
      },
    };
  }
}

export default GovtJobsPage;