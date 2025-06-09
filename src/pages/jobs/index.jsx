import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import dbConnect from '@/lib/dbConnect';
import { Job } from '@/lib/models/Job';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const generateMetaDescription = (filters, searchKeyword, totalJobs = 0) => {
  let description = `Browse ${totalJobs} open positions`;
  if (searchKeyword) {
    description = `${totalJobs} ${searchKeyword} jobs available`;
  }
  if (filters.city && filters.city !== "All") {
    description += ` in ${filters.city}`;
  }
  if (filters.positionType && filters.positionType !== "All") {
    description += ` for ${filters.positionType} positions`;
  }
  return description + ". Find your next career opportunity with us.";
};

const generateJobListingSchema = (jobs, baseUrl) => {
  return jobs.map(job => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.jobTitle,
    "description": job.positionSummary,
    "datePosted": job.createdAt,
    "validThrough": job.applicationDeadline,
    "employmentType": job.positionType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.companyName,
      "description": job.companyOverview,
      "sameAs": baseUrl
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.city,
        "addressRegion": job.state,
        "addressCountry": job.country
      }
    },
    "experienceRequirements": job.experience,
    "qualifications": job.education.join(", "),
    "skills": [...job.languages, ...job.frameworks, ...job.databases].join(", "),
    "applicationDeadline": job.applicationDeadline,
    "occupationalCategory": job.category,
    "jobBenefits": job.benefits.join(", "),
    "directApply": job.submissionMethod === 'portal' ? true : false
  }));
};

const Jobs = ({ initialData, initialFilters, initialSearch, baseUrl }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    city: initialFilters.city || "All",
    positionType: initialFilters.positionType || "All",
    page: initialFilters.page || 1
  });

  const [searchKeyword, setSearchKeyword] = useState(initialSearch || "");
  const debouncedSearchTerm = useDebounce(searchKeyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.city !== "All") params.set('city', filters.city);
    if (filters.positionType !== "All") params.set('positionType', filters.positionType);
    if (debouncedSearchTerm) params.set('q', debouncedSearchTerm);
    params.set('page', filters.page);
    router.push(`/jobs?${params.toString()}`);
  }, [filters, debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const sanitizeJSON = (data) => {
    return JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');
  };

  return (
    <>
      <Head>
        <meta name="robots" content={filters.page === 1 ? "index, follow" : "noindex, follow"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: sanitizeJSON(generateJobListingSchema(initialData.jobs || [], baseUrl))
          }}
        />
      </Head>
  
      <NextSeo
        title={`${searchKeyword || 'Job Openings'} ${filters.city !== "All" ? `in ${filters.city}` : ''} | Exameets`}
        description={generateMetaDescription(filters, searchKeyword, initialData.totalJobs)}
      />
  
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#e6f4ff] dark:bg-gray-800 p-6 rounded-lg mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#003366] dark:text-white">
                Job Openings
              </h2>
            </div>
  
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  id="job-search"
                  name="job-search"
                  type="search"
                  placeholder="Search Jobs..."
                  value={searchKeyword}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <select
                  id="city-filter"
                  name="city-filter"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
  
                <select
                  id="position-type-filter"
                  name="position-type-filter"
                  value={filters.positionType}
                  onChange={(e) => handleFilterChange("positionType", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="All">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {initialData.jobs?.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
                No jobs found matching your criteria. Try adjusting your filters or search term.
              </div>
            ) : (
              initialData.jobs?.map((job) => (
                <div 
                  key={job._id} 
                  className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:scale-105 transition-transform relative h-full"
                >
                  {/* Title Section */}
                  <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {job.jobTitle}
                  </h3>
                  
                  {/* Company with Border */}
                  <div className="text-sm text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-1">
                    {job.companyName}
                  </div>
                  
                  {/* Content Section */}
                  <div className="grid gap-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Location: {job.city}, {job.state}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Experience: {job.experience}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Education: {job.education.join(", ")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Position: {job.positionType}
                    </div>
                  </div>
                  
                  {/* Footer Section */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                    <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">
                      {formatDate(job.applicationDeadline || job.createdAt)}
                    </span>
                    <a 
                      href={`/jobs/${job.slug}`}
                      className="text-[#015990] dark:text-blue-400 font-medium hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
  
          {initialData.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 my-8">
              <button
                className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                  filters.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </button>
              
              <div className="text-gray-600 dark:text-gray-300">
                Page {filters.page} of {initialData.totalPages}
              </div>
  
              <button
                className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
                  filters.page === initialData.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-700'
                }`}
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === initialData.totalPages}
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
  const filters = {
    city: query.city || "All",
    positionType: query.positionType || "All"
  };

  const dbQuery = {};
  if (filters.city !== "All") dbQuery.city = filters.city;
  if (filters.positionType !== "All") dbQuery.positionType = filters.positionType;

  if (query.q) {
    dbQuery.$or = [
      { jobTitle: { $regex: query.q, $options: 'i' } },
      { companyName: { $regex: query.q, $options: 'i' } },
      { positionSummary: { $regex: query.q, $options: 'i' } },
      { 'languages': { $regex: query.q, $options: 'i' } },
      { 'frameworks': { $regex: query.q, $options: 'i' } }
    ];
  }

  try {
    const totalJobs = await Job.countDocuments(dbQuery);
    const jobs = await Job.find(dbQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Convert all ObjectIds and Dates to strings
    const serializedJobs = JSON.parse(JSON.stringify(jobs, (key, value) => {
      if (key === '_id' || (key === 'postedBy' && value && value._id)) {
        return value.toString();
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));

    let baseUrl = process.env.BASE_URL;
    if (!baseUrl && req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host || 'localhost:3000';
      baseUrl = `${protocol}://${host}`;
    }

    return {
      props: {
        initialData: {
          jobs: serializedJobs,
          totalJobs,
          totalPages: Math.ceil(totalJobs / limit)
        },
        initialFilters: { ...filters, page },
        initialSearch: query.q || "",
        baseUrl: baseUrl || 'http://localhost:3000'
      }
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      props: {
        initialData: {
          jobs: [],
          totalJobs: 0,
          totalPages: 0
        },
        initialFilters: { city: "All", positionType: "All", page: 1 },
        initialSearch: "",
        baseUrl: 'http://localhost:3000'
      }
    };
  }
}

export default Jobs;