import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch } from 'react-icons/fa';
import { School, GraduationCap } from 'lucide-react';
import Head from "next/head";
import { NextSeo } from "next-seo";
import dbConnect from "@/lib/dbConnect";
import { Scholarship } from "@/lib/models/Scholarship";

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

// Replace the existing generateMetaDescription function
const generateMetaDescription = (searchKeyword, totalScholarships = 0, filters = {}) => {
  if (totalScholarships === 0) {
    return "No scholarships found. Browse latest scholarship opportunities and educational funding across India on Exameets.";
  }
  let description = `Browse ${totalScholarships} scholarship opportunities`;
  if (searchKeyword) description = `${totalScholarships} ${searchKeyword} scholarships available`;
  if (filters.category && filters.category !== 'All') description += ` in ${filters.category} category`;
  if (filters.qualification && filters.qualification !== 'All') description += ` for ${filters.qualification} students`;
  return description + `. Find merit-based, need-based, and government scholarships on Exameets.`;
};

// Replace the existing generateScholarshipSchema function
const generateScholarshipListingSchema = (scholarships, baseUrl) => {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": scholarships.map((scholarship, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${baseUrl}/scholarships/${scholarship.slug}`,
        "name": scholarship.title,
        "item": {
          "@type": "Scholarship",
          "@id": `${baseUrl}/scholarships/${scholarship.slug}`,
          "name": scholarship.title,
          "description": scholarship.description,
          "provider": {
            "@type": "Organization",
            "name": scholarship.organization
          },
          "awardAmount": {
            "@type": "MonetaryAmount",
            "value": scholarship.amount,
            "currency": "INR"
          },
          "eligibilityCriteria": scholarship.eligibility_criteria,
          "applicationDeadline": scholarship.last_date,
          "datePosted": scholarship.createdAt,
          "scholarshipCategory": scholarship.category
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

const Scholarships = ({ initialData, initialFilters, initialSearch, baseUrl }) => {
  const router = useRouter();

  // Initialize state from SSR props
  const [filters, setFilters] = useState({
    category: initialFilters.category || "All",
    qualification: initialFilters.qualification || "All"
  });
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "");
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showQualificationDropdown, setShowQualificationDropdown] = useState(false);
  
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const searchInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const qualificationDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (qualificationDropdownRef.current && !qualificationDropdownRef.current.contains(event.target)) {
        setShowQualificationDropdown(false);
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
    if (filters.category && filters.category !== "All") params.set("category", filters.category);
    if (filters.qualification && filters.qualification !== "All") params.set("qualification", filters.qualification);
    if (debouncedSearchKeyword) params.set("q", debouncedSearchKeyword);
    params.set("page", currentPage);
    router.push(`/scholarships?${params.toString()}`);
  }, [filters, debouncedSearchKeyword, currentPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
    setShowCategoryDropdown(false);
    setShowQualificationDropdown(false);
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

  const handleViewDetails = (scholarshipSlug) => {
    router.push(`/scholarships/${scholarshipSlug}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { scholarships = [], totalScholarships = 0 } = initialData || {};
  const totalPages = Math.ceil(totalScholarships / (initialData.limit || 8));
  
  // Build pagination object based on computed totalPages
  const pagination = {
    totalPages,
    currentPage,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Merit-based', label: 'Merit Based' },
    { value: 'Need-based', label: 'Need Based' },
    { value: 'Research', label: 'Research' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Cultural', label: 'Cultural' },
    { value: 'International', label: 'International' },
    { value: 'Government', label: 'Government' },
    { value: 'Private', label: 'Private' },
    { value: 'Other', label: 'Other' }
  ];

  const qualificationOptions = [
    { value: 'All', label: 'All Qualifications' },
    { value: 'Class 8', label: 'Class 8' },
    { value: 'Class 9', label: 'Class 9' },
    { value: 'Class 10', label: 'Class 10' },
    { value: 'Class 11', label: 'Class 11' },
    { value: 'Class 12', label: 'Class 12' },
    { value: 'Graduation', label: 'Graduation' },
    { value: 'Post Graduation', label: 'Post Graduation' },
    { value: 'Post Graduation Diploma', label: 'Post Graduation Diploma' },
    { value: 'Phd', label: 'Phd' },
    { value: 'ITI', label: 'ITI' },
    { value: 'Polytechnic/Diploma', label: 'Polytechnic/Diploma' },
    { value: 'Post Doctoral', label: 'Post Doctoral' },
    { value: 'Vocational Course', label: 'Vocational Course' },
    { value: 'Coaching classes', label: 'Coaching classes' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <>
      <Head>
        <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJSON(generateScholarshipListingSchema(scholarships || [], baseUrl))
          }}
        />
        <link rel="canonical" href={`${baseUrl}/scholarships`} />
      </Head>

      <NextSeo
        canonical={`${baseUrl}/scholarships`}
        title={`${searchKeyword ? `${searchKeyword} Scholarships` : 'Latest Scholarship Opportunities'} | Exameets`}
        description={generateMetaDescription(searchKeyword, totalScholarships, filters)}
        openGraph={{
          url: `${baseUrl}/scholarships`,
          title: `${searchKeyword ? `${searchKeyword} Scholarships` : 'Latest Scholarship Opportunities'} | Exameets`,
          description: generateMetaDescription(searchKeyword, totalScholarships, filters),
          images: [
            {
              url: `${baseUrl}/api/og/scholarships`,
              width: 1200,
              height: 630,
              alt: 'Scholarship Opportunities on Exameets',
            }
          ],
          type: 'website'
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              'scholarships',
              'educational funding',
              'merit scholarships',
              'need based scholarships',
              'government scholarships',
              'student financial aid',
              ...(searchKeyword ? [searchKeyword] : []),
              ...(filters.category && filters.category !== 'All' ? [filters.category + ' scholarships'] : []),
              ...(filters.qualification && filters.qualification !== 'All' ? [filters.qualification + ' scholarships'] : [])
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
              <h2 className="text-3xl font-bold ml-2 text-[#003366] dark:text-white">
                Scholarships
              </h2>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <input
                    id="scholarship-search"
                    name="scholarship-search"
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchKeyword}
                    onChange={handleSearch}
                    ref={searchInputRef}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  <FaSearch className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
                </div>
                
                {/* Category Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowQualificationDropdown(false);
                    }}
                    className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <GraduationCap className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {categoryOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('category', option.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                            filters.category === option.value
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

                {/* Qualification Dropdown */}
                <div className="relative" ref={qualificationDropdownRef}>
                  <button
                    onClick={() => {
                      setShowQualificationDropdown(!showQualificationDropdown);
                      setShowCategoryDropdown(false);
                    }}
                    className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <School className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  {showQualificationDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {qualificationOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('qualification', option.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                            filters.qualification === option.value
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
                  id="scholarships-search-desktop"
                  name="scholarships-search-desktop"
                  type="text"
                  placeholder="Search scholarships..."
                  value={searchKeyword}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  aria-label="Search scholarships"
                />
              </div>
              <div className="flex gap-2">
                <select
                  id="scholarships-category"
                  name="category"
                  value={filters.category}
                  onChange={handleDesktopFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Merit-based">Merit Based</option>
                  <option value="Need-based">Need Based</option>
                  <option value="Research">Research</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="International">International</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  id="scholarships-qualification"
                  name="qualification"
                  value={filters.qualification}
                  onChange={handleDesktopFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Qualifications</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Under Graduation">Under Graduation</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Post Graduation Diploma">Post Graduation Diploma</option>
                  <option value="Phd">Phd</option>
                  <option value="ITI">ITI</option>
                  <option value="Polytechnic/Diploma">Polytechnic/Diploma</option>
                  <option value="Post Doctoral">Post Doctoral</option>
                  <option value="Vocational Course">Vocational Course</option>
                  <option value="Coaching classes">Coaching classes</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {scholarships.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                No scholarships found matching your criteria. Try adjusting your filters or search term.
                {(searchKeyword || filters.category !== "All" || filters.qualification !== "All") && (
                  <button
                    className="mt-4 bg-[#015990] dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setSearchKeyword("");
                      setFilters({ category: "All", qualification: "All" });
                      setCurrentPage(1);
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              scholarships.map((scholarship) => (
                <div 
                  key={scholarship._id} 
                  className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
                >
                  {/* Title Section */}
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {scholarship.title}
                  </h3>
                  
                  {/* Organization with Border */}
                  <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                    {scholarship.organization}
                  </div>
                  
                  {/* Content Section */}
                  <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-bold">Category:</span> {scholarship.category}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-bold">Amount:</span> {scholarship.amount}
                    </div>
                  </div>
                  
                  {/* Footer Section */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                      {scholarship.qualification}
                    </span>
                    <button
                      className="text-[#015990] dark:text-blue-400 font-bold hover:underline"
                      onClick={() => handleViewDetails(scholarship.slug)}
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
    </>
  );
};

export async function getServerSideProps(context) {
  const { query, req } = context;
  await dbConnect();

  // Pagination and filter parameters
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 8;
  const category = query.category || "All";
  const qualification = query.qualification || "All";
  const searchKeyword = query.q || "";

  // Build query object based on schema
  const dbQuery = {};
  
  // Category filter
  if (category !== "All") dbQuery.category = category;
  
  // Qualification filter
  if (qualification !== "All") dbQuery.qualification = qualification;
  
  // Search filter
  if (searchKeyword) {
    dbQuery.$or = [
      { title: { $regex: searchKeyword, $options: 'i' } },
      { organization: { $regex: searchKeyword, $options: 'i' } },
      { description: { $regex: searchKeyword, $options: 'i' } },
      { eligibility_criteria: { $regex: searchKeyword, $options: 'i' } },
      { keywords: { $in: [new RegExp(searchKeyword, 'i')] } },
      { searchDescription: { $regex: searchKeyword, $options: 'i' } }
    ];
  }

  try {
    // Get total count and paginated results
    const totalScholarships = await Scholarship.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalScholarships / limit);
    const skip = (page - 1) * limit;

    const scholarships = await Scholarship.find(dbQuery)
      .sort({ is_featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Serialize the MongoDB objects for JSON
    const serializedScholarships = scholarships.map(scholarship => {
      // Handle various data types safely
      const serialized = {
        ...scholarship,
        _id: scholarship._id.toString()
      };
      
      // Handle createdAt date (might be string, Date, or undefined)
      if (scholarship.createdAt) {
        serialized.createdAt = typeof scholarship.createdAt === 'object' && scholarship.createdAt.toISOString 
          ? scholarship.createdAt.toISOString() 
          : String(scholarship.createdAt);
      } else {
        serialized.createdAt = new Date().toISOString();
      }
      
      // Handle postedBy (might be ObjectId or undefined)
      if (scholarship.postedBy) {
        serialized.postedBy = scholarship.postedBy.toString();
      } else {
        serialized.postedBy = null;
      }
      
      return serialized;
    });

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
          scholarships: serializedScholarships,
          totalScholarships,
          limit,
          totalPages
        },
        initialFilters: { category, qualification, page },
        initialSearch: searchKeyword,
        baseUrl: baseUrl || 'http://localhost:3000'
      }
    };
  } catch (error) {
    console.error("Database query failed:", error);
    return {
      props: {
        initialData: {
          scholarships: [],
          totalScholarships: 0,
          limit: 8,
          totalPages: 0
        },
        initialFilters: {
          category: "All",
          qualification: "All",
          page: 1
        },
        initialSearch: "",
        baseUrl: "http://localhost:3000"
      }
    };
  }
}

export default Scholarships;