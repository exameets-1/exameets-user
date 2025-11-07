import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch } from 'react-icons/fa';
import { Briefcase, MapPinCheck, ArrowRight } from 'lucide-react';
import Head from "next/head";
import { NextSeo } from "next-seo";
import dbConnect from "@/lib/dbConnect";
import { Internship } from "@/lib/models/Internship";

// Helper functions for SEO and structured data
const generateMetaDescription = (searchKeyword, totalInternships = 0, filters = {}) => {
  if (totalInternships === 0) {
    return "No internships found. Browse latest internship opportunities across India on Exameets.";
  }
  let description = `Browse ${totalInternships} internship opportunities`;
  if (searchKeyword) description = `${totalInternships} ${searchKeyword} internships available`;
  if (filters.city && filters.city !== 'All') description += ` in ${filters.city}`;
  return description + `. Find remote and on-site internships with stipends on Exameets.`;
};

const generateInternshipListingSchema = (internships, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": internships.map((internship, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/internships/${internship.slug}`,
        "name": internship.title,
        "item": {
          "@type": "JobPosting",
          "@id": `${baseUrl}/internships/${internship.slug}`,
          "title": internship.title,
          "description": internship.description,
          "datePosted": internship.createdAt,
          "validThrough": internship.last_date,
          "employmentType": "INTERN",
          "hiringOrganization": {
            "@type": "Organization",
            "name": internship.organization
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": internship.location,
              "addressCountry": "IN"
            }
          },
          "baseSalary": {
            "@type": "MonetaryAmount",
            "value": internship.stipend,
            "currency": "INR"
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

// Update component props to include baseUrl
const Internships = ({ initialData, initialFilters, initialSearch, baseUrl }) => {
  const router = useRouter();

  // Initialize state from SSR props
  const [filters, setFilters] = useState({
    city: initialFilters.city || "All",
    internship_type: initialFilters.internship_type || "All",
  });
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "");
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

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

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const searchInputRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
    setShowLocationDropdown(false);
    setShowTypeDropdown(false);
  };

  const handleDesktopFilterChange = (e) => {
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
  const pagination = {
    totalPages,
    currentPage,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };

  // Build the canonical URL
  const canonicalUrl = `${baseUrl}/internships`;

  const locationOptions = [
    { value: 'All', label: 'All Cities' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Remote', label: 'Remote' }
  ];

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Remote', label: 'Remote' },
    { value: 'On-Site', label: 'On-Site' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Head>
        <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJSON(generateInternshipListingSchema(internships || [], baseUrl))
          }}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <NextSeo
        canonical={canonicalUrl}
        title={`${searchKeyword ? `${searchKeyword} Internships` : 'Latest Internship Opportunities'} | Exameets`}
        description={generateMetaDescription(searchKeyword, totalInternships, filters)}
        openGraph={{
          url: canonicalUrl,
          title: `${searchKeyword ? `${searchKeyword} Internships` : 'Latest Internship Opportunities'} | Exameets`,
          description: generateMetaDescription(searchKeyword, totalInternships, filters),
          images: [
            {
              url: `${baseUrl}/api/og/internships`,
              width: 1200,
              height: 630,
              alt: 'Internship Opportunities on Exameets',
            }
          ],
          type: 'website'
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              'internships',
              'internship opportunities',
              'student internships',
              'remote internships',
              'paid internships',
              'internship program',
              ...(searchKeyword ? [searchKeyword] : []),
              ...(filters.city && filters.city !== 'All' ? [filters.city + ' internships'] : [])
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

      <div className="max-w-7xl mx-auto">
        <div className="bg-[#e6f4ff] dark:bg-gray-800 p-1.5 rounded-lg mb-8">
          <div className="mb-2">
            <h2 className="text-3xl ml-2 font-bold text-[#003366] dark:text-white">
              Internships
            </h2>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <input
                  id="internship-search"
                  name="internship-search"
                  type="text"
                  placeholder="Search internships..."
                  value={searchKeyword}
                  onChange={handleSearch}
                  ref={searchInputRef}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
              </div>
              
              {/* Location Dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <button
                  onClick={() => {
                    setShowLocationDropdown(!showLocationDropdown);
                    setShowTypeDropdown(false);
                  }}
                  className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <MapPinCheck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                {showLocationDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {locationOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('city', option.value)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                          filters.city === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Dropdown */}
              <div className="relative" ref={typeDropdownRef}>
                <button
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowLocationDropdown(false);
                  }}
                  className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterChange('internship_type', option.value)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                          filters.internship_type === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Unchanged */}
          <div className="hidden md:flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                id="internship-search-desktop"
                name="internship-search-desktop"
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
                name="city"
                value={filters.city}
                onChange={handleDesktopFilterChange}
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
                onChange={handleDesktopFilterChange}
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
                {/* Company/Organization Logo Image - Small square in top right */}
                {internship.imageUrl && (
                  <div className="absolute top-3 right-3 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 z-10">
                    <img 
                      src={internship.imageUrl} 
                      alt={internship.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title Section - Now positioned to overlap with image */}
                <div className="pr-16 sm:pr-18 md:pr-20">
                  {internship.title ? (
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] leading-tight">
                    {internship.title}
                  </h3>
                  ) : null}
                </div>

                {/* Organization with Border - Also with right padding to avoid image overlap */}
                {internship.organization ? (
                <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1 pr-16 sm:pr-18 md:pr-20">
                  {internship.organization}
                </div>
                ) : null}

                {/* Content Section */}
                <div className="grid gap-2 mb-4">
                  {internship.location ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Location:</span> {internship.location}
                  </div>
                  ) : null}
                  {internship.duration ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Duration:</span> {internship.duration}
                  </div>
                  ) : null}
                  {internship.start_date ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Start Date:</span> {(internship.start_date)}
                  </div>
                  ) : null}
                  {internship.last_date ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Last Date to Apply:</span> {(internship.last_date)}
                  </div>
                  ) : null}
                </div>
                {/* Footer Section */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                  {internship.stipend ? (
                  <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                    Stipend: {internship.stipend}
                  </span>
                  ) : null}
                  <a
                    href={`/internships/${internship.slug}?from=${encodeURIComponent(router.asPath)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#015990] dark:text-blue-400 font-bold hover:underline"
                  >
                    View Details <ArrowRight className="w-4 h-4 inline-block mb-1" />
                  </a>
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
  try {
    const { query, req } = context;
    
    // Connect to database with error handling
    try {
      await dbConnect();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      throw new Error("Failed to connect to database");
    }

    // Pagination and filter parameters with validation
    const page = Math.max(1, parseInt(query.page) || 1); // Ensure page is at least 1
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 8)); // Limit between 1 and 50
    const city = (query.city && typeof query.city === 'string') ? query.city : "All";
    const internship_type = (query.internship_type && typeof query.internship_type === 'string') ? query.internship_type : "All";
    const searchKeyword = (query.q && typeof query.q === 'string') ? query.q : "";

    // Build query object based on schema
    const dbQuery = {};
  if (city !== "All") dbQuery.location = city;
  if (internship_type !== "All") dbQuery.internship_type = internship_type;
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
      // Get total count and paginated results with error handling
      let totalInternships = 0;
      try {
        totalInternships = await Internship.countDocuments(dbQuery);
      } catch (countError) {
        console.error("Error counting internships:", countError);
        throw new Error("Failed to count internships");
      }

      const totalPages = Math.ceil(totalInternships / limit);
      const skip = (page - 1) * limit;

      // Fetch internships with error handling
      let internships = [];
      try {
        internships = await Internship.find(dbQuery)
          .sort({ createdAt: -1, is_featured: -1 })
          .skip(skip)
          .limit(limit)
          .lean();
      } catch (findError) {
        console.error("Error fetching internships:", findError);
        throw new Error("Failed to fetch internships");
      }

      // Safely serialize internships with null checks
      const serializedInternships = internships.map(internship => {
        try {
          return {
            ...internship,
            _id: internship._id?.toString() || '',
            createdAt: internship.createdAt?.toISOString() || new Date().toISOString(),
            postedBy: internship.postedBy?.toString() || null,
            start_date: internship.start_date || null,
            last_date: internship.last_date || null,
            skills_required: Array.isArray(internship.skills_required) ? internship.skills_required : []
          };
        } catch (serializeError) {
          console.error("Error serializing internship:", serializeError);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from serialization errors

      // Generate base URL with validation
      let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl && req) {
        try {
          const protocol = req.headers['x-forwarded-proto'] || 'http';
          const host = req.headers.host;
          if (!host) throw new Error('No host found in request headers');
          baseUrl = `${protocol}://${host}`;
        } catch (urlError) {
          console.error("Error generating base URL:", urlError);
          baseUrl = 'http://localhost:3000';
        }
      }

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
          baseUrl: baseUrl || 'http://localhost:3000'
        }
      };

    } catch (error) {
      console.error("Server-side props generation failed:", error);
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
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        }
      };
    }
  } catch (outerError) {
    console.error("Critical error in getServerSideProps:", outerError);
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
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }
    };
  }
}

export default Internships;