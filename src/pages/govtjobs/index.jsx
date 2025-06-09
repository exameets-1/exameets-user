import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import dbConnect from '@/lib/dbConnect';
import { GovtJob } from '@/lib/models/GovtJob';
import useDebounce from '@/hooks/useDebounce'; // Create this hook or use a utility
import Link from 'next/link';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
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
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Kolkata">Kolkata</option>
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
                className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
              >
                <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                  {job.jobTitle}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                  {job.organization}
                </div>
                <div className="grid gap-2 mb-4">
                  {job.jobLocation && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Location: {job.jobLocation}
                    </div>
                  )}
                  {job.postNames && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Post: {job.postNames}
                    </div>
                  )}
                  {job.educationalQualifications && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Qualification: {job.educationalQualifications}
                    </div>
                  )}
                  {job.applicationStartDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Start: {job.applicationStartDate}
                    </div>
                  )}
                  {job.applicationEndDate && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Close: {job.applicationEndDate}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                    {job.totalVacancies ? `${job.totalVacancies} posts` : 'General'}
                  </span>
                  <Link 
                    href={`/govtjobs/${job.slug}`}
                    className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
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
  );
};

// export async function getServerSideProps(context) {
//   try {
//     const { query } = context;
//     const { location, sort, searchKeyword, page = 1, limit = 8 } = query;

//     // Build query
//     const dbQuery = {};
//     if (location && location !== 'All') {
//       dbQuery.jobLocation = { $regex: location, $options: 'i' };
//     }

//     if (searchKeyword) {
//       dbQuery.$or = [
//         { jobTitle: { $regex: searchKeyword, $options: 'i' } },
//         { organization: { $regex: searchKeyword, $options: 'i' } },
//         { jobLocation: { $regex: searchKeyword, $options: 'i' } },
//         { postNames: { $regex: searchKeyword, $options: 'i' } },
//         { notification_about: { $regex: searchKeyword, $options: 'i' } },
//         { jobOverview: { $regex: searchKeyword, $options: 'i' } }
//       ];
//     }

//     // Sort options
//     let sortOptions = {};
//     if (sort === 'recent') {
//       sortOptions.notificationReleaseDate = -1;
//     } else if (sort === 'deadline') {
//       sortOptions.applicationEndDate = 1;
//     }

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const totalJobs = await GovtJob.countDocuments(dbQuery);
//     const govtJobs = await GovtJob.find(dbQuery)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .lean();

//     // Format dates consistently
//     const formattedJobs = govtJobs.map(job => ({
//       ...job,
//       applicationStartDate: formatDate(job.applicationStartDate),
//       applicationEndDate: formatDate(job.applicationEndDate),
//       notificationReleaseDate: formatDate(job.notificationReleaseDate),
//       createdAt: formatDate(job.createdAt),
//       updatedAt: formatDate(job.updatedAt)
//     }));

//     return {
//       props: {
//         govtJobs: JSON.parse(JSON.stringify(formattedJobs)),
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalJobs / parseInt(limit)),
//         totalJobs,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching government jobs:', error);
//     return {
//       props: {
//         error: error.message || 'Failed to load government jobs',
//         govtJobs: [],
//         currentPage: 1,
//         totalPages: 0,
//         totalJobs: 0,
//       },
//     };
//   }
// }

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

    if (searchKeyword) {
      dbQuery.$text = { $search: searchKeyword }; // Use text index instead of regex
    }

    // Sort options
    let sortOptions = {};
    if (searchKeyword) {
      sortOptions = { score: { $meta: "textScore" } }; // Relevance if searching
    } else if (sort === 'recent') {
      sortOptions.notificationReleaseDate = -1;
    } else if (sort === 'deadline') {
      sortOptions.applicationEndDate = 1;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalJobs = await GovtJob.countDocuments(dbQuery);
    const govtJobs = await GovtJob.find(dbQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select(searchKeyword ? { score: { $meta: "textScore" } } : {}) // Only project score if searching
      .lean();

    // Format dates simply (to string)
    const formattedJobs = govtJobs.map(job => ({
      ...job,
      applicationStartDate: formatDate(job.applicationStartDate),
      applicationEndDate: formatDate(job.applicationEndDate),
      notificationReleaseDate: formatDate(job.notificationReleaseDate),
      createdAt: formatDate(job.createdAt),
      updatedAt: formatDate(job.updatedAt)
    }));

    return {
      props: {
        govtJobs: JSON.parse(JSON.stringify(formattedJobs)),
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