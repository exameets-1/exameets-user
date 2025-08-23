import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

// Generate description for SEO
const generateMetaDescription = (filters, searchKeyword, totalScholarships = 0) => {
  let description = `Browse ${totalScholarships} scholarship opportunities`;
  if (searchKeyword) {
    description = `${totalScholarships} ${searchKeyword} scholarships available`;
  }
  if (filters.category && filters.category !== "All") {
    description += ` in ${filters.category} category`;
  }
  if (filters.qualification && filters.qualification !== "All") {
    description += ` for ${filters.qualification} students`;
  }
  return description + ". Find your next educational funding opportunity with us.";
};

// Generate schema.org structured data
const generateScholarshipSchema = (scholarships, baseUrl) => {
  return scholarships.map((scholarship) => ({
    "@context": "https://schema.org",
    "@type": "Scholarship",
    "@id": `${baseUrl}/scholarships/${scholarship.slug || scholarship._id}`,
    "name": scholarship.title,
    "description": scholarship.description,
    "provider": {
      "@type": "Organization",
      "name": scholarship.organization,
      "sameAs": baseUrl,
    },
    "awardAmount": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": scholarship.amount,
    },
    "eligibilityCriteria": scholarship.eligibility_criteria,
    "applicationDeadline": scholarship.last_date,
    "datePosted": scholarship.createdAt,
    "scholarshipCategory": scholarship.category,
    "url": `${baseUrl}/scholarships/${scholarship.slug || scholarship._id}`
  }));
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
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  
  // When filters or debounced search term change, update the URL to trigger a new SSR render
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== "All") params.set("category", filters.category);
    if (filters.qualification && filters.qualification !== "All") params.set("qualification", filters.qualification);
    if (debouncedSearchKeyword) params.set("q", debouncedSearchKeyword);
    params.set("page", currentPage);
    router.push(`/scholarships?${params.toString()}`);
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

  const handleViewDetails = (scholarshipSlug) => {
    router.push(`/scholarships/${scholarshipSlug}`);
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
    if (filters.category && filters.category !== "All") params.append("category", filters.category);
    if (filters.qualification && filters.qualification !== "All") params.append("qualification", filters.qualification);
    if (searchKeyword) params.append("q", searchKeyword);
    params.append("page", currentPage);
    return `${baseUrl}/scholarships?${params.toString()}`;
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

  const canonicalUrl = generateCanonicalUrl();

  return (
    <>
      <Head>
        <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
        <meta name="google" content="nositelinkssearchbox" />
        <meta name="google" content="notranslate" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />
      </Head>

      <NextSeo
        title={
          searchKeyword
            ? `${searchKeyword} Scholarships ${filters.category !== "All" ? `in ${filters.category}` : ""} | Exameets`
            : `Scholarship Opportunities ${filters.category !== "All" ? `in ${filters.category}` : ""} | Exameets`
        }
        description={generateMetaDescription(filters, searchKeyword, totalScholarships)}
        canonical={canonicalUrl}
        openGraph={{
          title: searchKeyword
            ? `${searchKeyword} Scholarships ${filters.category !== "All" ? `in ${filters.category}` : ""}`
            : `Scholarship Opportunities ${filters.category !== "All" ? `in ${filters.category}` : ""}`,
          description: generateMetaDescription(filters, searchKeyword, totalScholarships),
          url: canonicalUrl,
          type: "website",
          site_name: "Exameets Scholarships",
          images: [{
            url: `${baseUrl}/images/scholarships-og.jpg`,
            width: 1200,
            height: 630,
            alt: "Exameets Scholarships"
          }]
        }}
        twitter={{ cardType: "summary_large_image" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJSON(generateScholarshipSchema(scholarships || [], baseUrl))
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                Scholarships
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  id="scholarships-search"
                  name="scholarships-search"
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
                  name="scholarships-category"
                  value={filters.category}
                  onChange={handleFilterChange}
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
                  name="scholarships-qualification"
                  value={filters.qualification}
                  onChange={handleFilterChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Qualifications</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Graduation">Graduation</option>
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
                  <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                    {scholarship.organization}
                  </div>
                  
                  {/* Content Section */}
                  <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Category: {scholarship.category}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Amount: {scholarship.amount}
                    </div>
                    {/* <div className="text-sm text-gray-600 dark:text-gray-300">
                      Last Date: {formatDate(scholarship.last_date)}
                    </div> */}
                  </div>
                  
                  {/* Footer Section */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                      {scholarship.qualification}
                    </span>
                    <button
                      className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
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

    // Generate base URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

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
        baseUrl
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
        baseUrl: ""
      }
    };
  }
}

export default Scholarships;