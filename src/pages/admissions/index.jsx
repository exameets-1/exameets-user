import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaSearch } from 'react-icons/fa';
import { GraduationCap, MapPin } from 'lucide-react';
import Head from "next/head";
import { NextSeo } from "next-seo";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import { Admission } from "@/lib/models/Admission";

// Custom date formatter for consistent output (MMM DD, YYYY)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

// Generate description for SEO
const generateMetaDescription = (filters, searchKeyword, totalAdmissions = 0) => {
  let description = `Browse ${totalAdmissions} admission opportunities`;
  if (searchKeyword) {
    description = `${totalAdmissions} ${searchKeyword} admissions available`;
  }
  if (filters.location && filters.location !== "All") {
    description += ` in ${filters.location}`;
  }
  if (filters.category && filters.category !== "All") {
    description += ` in ${filters.category} category`;
  }
  return description + ". Find your next educational opportunity with us.";
};

// Generate schema.org structured data
const generateAdmissionListingSchema = (admissions, baseUrl) => {
  return admissions.map(admission => ({
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "@id": `${baseUrl}/admissions/${admission._id}`,
    "name": admission.title,
    "description": admission.description,
    "programPrerequisites": admission.eligibility_criteria,
    "occupationalCategory": admission.category,
    "applicationStartDate": admission.start_date,
    "applicationDeadline": admission.last_date,
    "provider": {
      "@type": "EducationalOrganization",
      "name": admission.institute,
      "sameAs": baseUrl,
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": admission.location.split(',')[0],
          "addressRegion": admission.location.split(',')[1]?.trim() || "India",
          "addressCountry": "IN"
        }
      }
    },
    "offers": {
      "@type": "Offer",
      "price": admission.fees,
      "priceCurrency": "INR"
    },
    "url": admission.application_link
  }));
};

const Admissions = ({ initialData, initialFilters, initialSearch, baseUrl }) => {
  const router = useRouter();

  // Initialize state from SSR props
  const [filters, setFilters] = useState({
    location: initialFilters.location || "All",
    category: initialFilters.category || "All",
    showActiveOnly: initialFilters.showActiveOnly || false
  });
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "");
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  
  const searchInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);
  

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
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
    if (filters.location && filters.location !== "All") params.set("location", filters.location);
    if (filters.category && filters.category !== "All") params.set("category", filters.category);
    if (debouncedSearchKeyword) params.set("q", debouncedSearchKeyword);
    params.set("page", currentPage);
    router.push(`/admissions?${params.toString()}`);
  }, [filters, debouncedSearchKeyword, currentPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
    setShowCategoryDropdown(false);
    setShowLocationDropdown(false);
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

  const handleViewDetails = (admissionSlug) => {
    router.push(`/admissions/${admissionSlug}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sanitizeJSON = (data) => {
    return JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')
      .replace(/'/g, '\\u0027');
  };

  // Build the canonical URL
  const generateCanonicalUrl = () => {
    const params = new URLSearchParams();
    if (filters.location && filters.location !== "All") params.append("location", filters.location);
    if (filters.category && filters.category !== "All") params.append("category", filters.category);
    if (searchKeyword) params.append("q", searchKeyword);
    params.append("page", currentPage);
    return `${baseUrl}/admissions?${params.toString()}`;
  };

  const { admissions = [], totalAdmissions = 0 } = initialData || {};
  const totalPages = Math.ceil(totalAdmissions / (initialData.limit || 8));
  
  // Build pagination object based on computed totalPages
  const pagination = {
    totalPages,
    currentPage,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };

  const canonicalUrl = generateCanonicalUrl();

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Science', label: 'Science' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Management', label: 'Management' },
    { value: 'Law', label: 'Law' },
    { value: 'Design', label: 'Design' },
    { value: 'Other', label: 'Other' }
  ];

  const locationOptions = [
    { value: 'All', label: 'All Locations' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Pune', label: 'Pune' }
  ];

  return (
    <>
      <Head>
        <title>Admissions | Exameets</title>
        <link rel="canonical" href={`https://www.exameets.in/admissions`} />
        < meta name="description" content="Explore the latest admission opportunities across various fields and locations. Find your next educational opportunity with Exameets." />
      </Head>

      <NextSeo
        title={
          searchKeyword
            ? `${searchKeyword} Admissions ${filters.location !== "All" ? `in ${filters.location}` : ""} | Exameets`
            : `Admission Openings ${filters.location !== "All" ? `in ${filters.location}` : ""} | Exameets`
        }
        description={generateMetaDescription(filters, searchKeyword, totalAdmissions)}
        canonical={canonicalUrl}
        openGraph={{
          title: searchKeyword
            ? `${searchKeyword} Admissions ${filters.location !== "All" ? `in ${filters.location}` : ""}`
            : `Admission Openings ${filters.location !== "All" ? `in ${filters.location}` : ""}`,
          description: generateMetaDescription(filters, searchKeyword, totalAdmissions),
          url: canonicalUrl,
          images: [{
            url: `${baseUrl}/images/admissions-og.jpg`,
            width: 1200,
            height: 630,
            alt: 'Exameets Admissions'
          }]
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJSON(generateAdmissionListingSchema(admissions || [], baseUrl))
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                Admissions
              </h2>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <input
                    id="admission-search"
                    name="admission-search"
                    type="text"
                    placeholder="Search admissions..."
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
                      setShowLocationDropdown(false);
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

                {/* Location Dropdown */}
                <div className="relative" ref={locationDropdownRef}>
                  <button
                    onClick={() => {
                      setShowLocationDropdown(!showLocationDropdown);
                      setShowCategoryDropdown(false);
                    }}
                    className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
                      {locationOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('location', option.value)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
                            filters.location === option.value
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
                  id="admissions-search-desktop"
                  name="admissions-search-desktop"
                  type="text"
                  placeholder="Search admissions..."
                  value={searchKeyword}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <select
                  id="admissions-category"
                  name="category"
                  value={filters.category}
                  onChange={handleDesktopFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medical">Medical</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Management">Management</option>
                  <option value="Law">Law</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleDesktopFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {admissions.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                No admissions found matching your criteria. Try adjusting your filters or search term.
                {(searchKeyword || filters.location !== "All" || filters.category !== "All") && (
                  <button
                    className="mt-4 bg-[#015990] dark:bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setSearchKeyword("");
                      setFilters({ location: "All", category: "All", showActiveOnly: false });
                      setCurrentPage(1);
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              admissions.map((admission) => (
                <div 
                  key={admission._id} 
                  className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-md hover:shadow-blue-250 dark:hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 ease-in-out relative h-full"
                >
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] overflow-hidden">
                    {admission.title}
                  </h3>
<div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 truncate whitespace-nowrap overflow-hidden">
  {admission.institute}
</div>

                  <div className="grid gap-2 mb-4 overflow-hidden">
                    {admission.location && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
                        <span className="font-bold">Location:</span> {admission.location}
                      </div>
                    )}
                    {admission.last_date && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
                        <span className="font-bold">Last Date:</span> {formatDate(admission.last_date)}
                      </div>
                    )}
                    {admission.eligibility_criteria && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
                        <span className="font-bold">Eligibility:</span> {admission.eligibility_criteria}
                      </div>
                    )}
                    {admission.fees && (
                      <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
                        <span className="font-bold">Fees:</span> {admission.fees}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {admission.category || 'General'}
                    </span>
                    <Link 
                      href={`/admissions/${admission.slug}`}
                      className="text-[#015990] dark:text-blue-400 font-bold hover:underline whitespace-nowrap ml-2 flex-shrink-0"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 my-8">
              <button
                className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                  !pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
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
                  !pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
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
  const location = query.location || "All";
  const category = query.category || "All";
  const searchKeyword = query.q || "";

  // Build query object based on schema
  const dbQuery = {};
  
  // Location filter
  if (location !== "All") dbQuery.location = { $regex: location, $options: 'i' };
  
  // Category filter
  if (category !== "All") dbQuery.category = category;
  
  // Search filter
  if (searchKeyword) {
    dbQuery.$or = [
      { title: { $regex: searchKeyword, $options: 'i' } },
      { institute: { $regex: searchKeyword, $options: 'i' } },
      { description: { $regex: searchKeyword, $options: 'i' } },
      { eligibility_criteria: { $regex: searchKeyword, $options: 'i' } },
      { keywords: { $in: [new RegExp(searchKeyword, 'i')] } },
      { searchDescription: { $regex: searchKeyword, $options: 'i' } }
    ];
  }

  try {
    // Get total count and paginated results
    const totalAdmissions = await Admission.countDocuments(dbQuery);
    const totalPages = Math.ceil(totalAdmissions / limit);
    const skip = (page - 1) * limit;

    const admissions = await Admission.find(dbQuery)
      .sort({ createdAt: -1, is_featured: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Serialize the MongoDB objects for JSON
    const serializedAdmissions = admissions.map(admission => {
      // Handle various data types safely
      const serialized = {
        ...admission,
        _id: admission._id.toString()
      };
      
      // Handle createdAt date (might be string, Date, or undefined)
      if (admission.createdAt) {
        serialized.createdAt = typeof admission.createdAt === 'object' && admission.createdAt.toISOString 
          ? admission.createdAt.toISOString() 
          : String(admission.createdAt);
      } else {
        serialized.createdAt = new Date().toISOString();
      }
      
      // Handle postedBy (might be ObjectId or undefined)
      if (admission.postedBy) {
        serialized.postedBy = admission.postedBy.toString();
      } else {
        serialized.postedBy = null;
      }
      
      return serialized;
    });

    // Generate base URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    return {
      props: {
        initialData: {
          admissions: serializedAdmissions,
          totalAdmissions,
          limit,
          totalPages
        },
        initialFilters: { location, category, page },
        initialSearch: searchKeyword,
        baseUrl
      }
    };
  } catch (error) {
    console.error("Database query failed:", error);
    return {
      props: {
        initialData: {
          admissions: [],
          totalAdmissions: 0,
          limit: 8,
          totalPages: 0
        },
        initialFilters: {
          location: "All",
          category: "All",
          page: 1
        },
        initialSearch: "",
        baseUrl: ""
      }
    };
  }
}

export default Admissions;