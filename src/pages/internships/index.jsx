import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { NextSeo } from "next-seo";
import dbConnect from "@/lib/dbConnect";
import { Internship } from "@/lib/models/Internship";

// Custom date formatter for consistent output (MM/DD/YYYY)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Debounce hook to limit rapid state updates
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const Internships = ({ initialData, initialFilters, initialSearch }) => {
  const router = useRouter();

  // Initialize state from SSR props
  const [filters, setFilters] = useState({
    city: initialFilters.city || "All",
    internship_type: initialFilters.internship_type || "All",
  });
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "");
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);

  // When filters or debounced search term change, update the URL to trigger a new SSR render
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.city && filters.city !== "All") params.set("city", filters.city);
    if (filters.internship_type && filters.internship_type !== "All")
      params.set("internship_type", filters.internship_type);
    if (debouncedSearchKeyword) params.set("q", debouncedSearchKeyword);
    params.set("page", currentPage);
    router.push(`/internships?${params.toString()}`);
  }, [filters, debouncedSearchKeyword, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleInternshipClick = (slug) => {
    router.push(`/internships/${slug}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { internships = [], totalInternships = 0 } = initialData || {};
  const totalPages = Math.ceil(totalInternships / (initialData.limit || 8));
  // Build pagination object based on computed totalPages
  const pagination = {
    totalPages,
    currentPage,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };

  // Build the canonical URL
  const canonicalUrl = (() => {
    const params = new URLSearchParams();
    if (filters.city && filters.city !== "All") params.append("city", filters.city);
    if (filters.internship_type && filters.internship_type !== "All")
      params.append("internship_type", filters.internship_type);
    if (searchKeyword) params.append("q", searchKeyword);
    params.append("page", currentPage);
    return `https://exameets.in/internships?${params.toString()}`;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Head>
        <title>Internships | Exameets</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <NextSeo
        title="Internships | Exameets"
        description={`Browse ${totalInternships} internships`}
        canonical={canonicalUrl}
        openGraph={{
          title: "Internships | Exameets",
          description: `Browse ${totalInternships} internships`,
          url: canonicalUrl,
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
              Internships
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                id="internship-search"
                name="internship-search"
                type="text"
                placeholder="Search internships..."
                value={searchKeyword}
                onChange={handleSearch}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                id="internship-location"
                name="internship_location"
                value={filters.city}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Cities</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Remote">Remote</option>
              </select>
              <select
                id="internship-type"
                name="internship_type"
                value={filters.internship_type}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="Remote">Remote</option>
                <option value="On-Site">On-Site</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {internships.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
              No internships found matching your criteria. Try adjusting your filters or search term.
            </div>
          ) : (
            internships.map((internship) => (
              <div 
                key={internship._id} 
                className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
              >
                {/* Title Section */}
                <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-1 min-h-[1.75rem]">
                  {internship.title}
                </h3>
                {/* Organization with Border */}
                <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                  {internship.organization}
                </div>
                {/* Content Section */}
                <div className="grid gap-2 mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Location: {internship.location}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Duration: {internship.duration}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Start Date: {(internship.start_date) === "" ? "Not specified" : (internship.start_date)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Last Date to Apply: {(internship.last_date) === "" ? "Not specified" : (internship.last_date)}
                  </div>
                </div>
                {/* Footer Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  {/* <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                    Stipend: {internship.stipend}
                  </span> */}
                  <button
                    className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleInternshipClick(internship.slug);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 my-8">
            <button
              className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                !pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(pagination.prevPage)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </button>
            
            <div className="text-gray-600 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>

            <button
              className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                !pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              onClick={() => handlePageChange(pagination.nextPage)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { query, req } = context;
  await dbConnect();

  // Pagination and filter parameters
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 8;
  const city = query.city || "All";
  const internship_type = query.internship_type || "All";
  const searchKeyword = query.q || "";

  // Build query object based on schema
  const dbQuery = {};
  
  // Location filter
  if (city !== "All") dbQuery.location = city;
  
  // Internship type filter
  if (internship_type !== "All") dbQuery.internship_type = internship_type;
  
  // Search filter
  if (searchKeyword) {
    dbQuery.$or = [
      { title: { $regex: searchKeyword, $options: 'i' } },
      { organization: { $regex: searchKeyword, $options: 'i' } },
      { description: { $regex: searchKeyword, $options: 'i' } },
      { skills_required: { $regex: searchKeyword, $options: 'i' } },
      { field: { $regex: searchKeyword, $options: 'i' } }
    ];
  }

  try {
    // Get total count and paginated results
    const totalInternships = await Internship.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalInternships / limit);
    const skip = (page - 1) * limit;

    const internships = await Internship.find(dbQuery)
      .sort({ post_date: -1, is_featured: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

// In your getServerSideProps function, update the serializedInternships mapping:
const serializedInternships = internships.map(internship => ({
  ...internship,
  _id: internship._id.toString(),
  createdAt: internship.createdAt.toISOString(),
  postedBy: internship.postedBy ? internship.postedBy.toString() : null, // Add this line
  start_date: internship.start_date,
  last_date: internship.last_date,
  skills_required: internship.skills_required || [] 
}));

    // Generate base URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    return {
      props: {
        initialData: {
          internships: serializedInternships,
          pagination: {
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
          },
          totalInternships,
          limit
        },
        initialFilters: { city, internship_type, page },
        initialSearch: searchKeyword,
        baseUrl
      }
    };
  } catch (error) {
    console.error("Database query failed:", error);
    return {
      props: {
        initialData: {
          internships: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
          },
          totalInternships: 0,
          limit: 8
        },
        initialFilters: {
          city: "All",
          internship_type: "All",
          page: 1
        },
        initialSearch: "",
        baseUrl: ""
      }
    };
  }
}

export default Internships;