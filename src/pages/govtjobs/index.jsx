// import { useRouter } from 'next/router';
// import { useEffect, useState, useRef } from 'react';
// import { FaSearch } from 'react-icons/fa';
// import { ArrowDown10, MapPinCheck,ArrowRight } from 'lucide-react';
// import dbConnect from '@/lib/dbConnect';
// import { GovtJob } from '@/lib/models/GovtJob';
// import useDebounce from '@/hooks/useDebounce'; // Create this hook or use a utility
// import Link from 'next/link';
// import { NextSeo } from 'next-seo';
// import Head from 'next/head';

// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   try {
//     // Handle DD-MM-YYYY format from MongoDB
//     if (typeof dateString === 'string' && dateString.includes('-')) {
//       const parts = dateString.split('-');
//       if (parts.length === 3) {
//         // Input is already in DD-MM-YYYY format, just return it
//         const day = parts[0].padStart(2, '0');
//         const month = parts[1].padStart(2, '0');
//         const year = parts[2];
//         return `${day}-${month}-${year}`;
//       }
//     }
    
//     // Fallback for other date formats (convert to DD-MM-YYYY)
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '';
    
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return '';
//   }
// };

// // Add meta/SEO helpers
// const generateMetaDescription = (filters, searchKeyword, totalJobs = 0) => {
//   if (totalJobs === 0) {
//     return "No government jobs found. Browse latest govt job notifications across India on Exameets.";
//   }
//   let description = `Explore ${totalJobs} government job notifications`;
//   if (searchKeyword) description = `${totalJobs} ${searchKeyword} government jobs available`;
//   if (filters.location && filters.location !== "All") description += ` in ${filters.location}`;
//   return description + `. Latest govt job alerts, recruitment notifications, and exam updates on Exameets.`;
// };

// const generateJobListingSchema = (jobs, baseUrl) => {
//   return {
//     "@context": "https://schema.org",
//     "@type": "SearchResultsPage",
//     "mainEntity": {
//       "@type": "ItemList",
//       "itemListElement": jobs.map((job, index) => ({
//         "@type": "ListItem",
//         "position": index + 1,
//         "url": `${baseUrl}/govtjobs/${job.slug}`,
//         "name": job.jobTitle
//       }))
//     }
//   };
// };

// const sanitizeJSON = (data) => {
//   return JSON.stringify(data)
//     .replace(/</g, '\\u003c')
//     .replace(/>/g, '\\u003e')
//     .replace(/&/g, '\\u0026');
// };

// // Update your component props to include baseUrl
// const GovtJobsPage = ({ govtJobs, currentPage, totalPages, totalJobs, error, baseUrl }) => {
//   const router = useRouter();
//   const [searchKeyword, setSearchKeyword] = useState(router.query.searchKeyword || '');
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const debouncedSearchTerm = useDebounce(searchKeyword, 500);
//   const searchInputRef = useRef(null);
//   const locationDropdownRef = useRef(null);
//   const sortDropdownRef = useRef(null);

//   // Sync search keyword with query parameter
//   useEffect(() => {
//     if (debouncedSearchTerm !== router.query.searchKeyword) {
//       const query = { ...router.query };
//       if (debouncedSearchTerm) {
//         query.searchKeyword = debouncedSearchTerm;
//       } else {
//         delete query.searchKeyword;
//       }
//       query.page = 1;
//       router.push({ pathname: router.pathname, query }).then(() => {
//         // Refocus the search bar after the search operation completes
//         if (searchInputRef.current) {
//           searchInputRef.current.focus();
//         }
//       });
//     }
//   }, [debouncedSearchTerm]);

//   // Update local state when query changes
//   useEffect(() => {
//     setSearchKeyword(router.query.searchKeyword || '');
//   }, [router.query.searchKeyword]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
//         setShowLocationDropdown(false);
//       }
//       if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
//         setShowSortDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleFilterChange = (filterType, value) => {
//     const query = { ...router.query };
//     query[filterType] = value;
//     query.page = 1;
//     router.push({ pathname: router.pathname, query });
//     setShowLocationDropdown(false);
//     setShowSortDropdown(false);
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       router.push({ 
//         pathname: router.pathname,
//         query: { ...router.query, page: newPage }
//       });
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   if (error) {
//     return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">Error: {error}</div>;
//   }

//   const locationOptions = [
//     { value: 'All', label: 'All Cities' },
//     { value: 'Ahmedabad', label: 'Ahmedabad' },
//     { value: 'Bangalore', label: 'Bangalore' },
//     { value: 'Chennai', label: 'Chennai' },
//     { value: 'Delhi', label: 'Delhi' },
//     { value: 'Hyderabad', label: 'Hyderabad' },
//     { value: 'Kolkata', label: 'Kolkata' },
//     { value: 'Mumbai', label: 'Mumbai' },
//     { value: 'Pune', label: 'Pune' }
//   ];

//   const sortOptions = [
//     { value: 'All', label: 'Default' },
//     { value: 'recent', label: 'Recent First' },
//     { value: 'deadline', label: 'Nearest Deadline' }
//   ];

//   return (
//     <>
//       <Head>
//         <meta name="robots" content={currentPage === 1 ? "index, follow" : "noindex, follow"} />
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: sanitizeJSON(generateJobListingSchema(govtJobs || [], baseUrl))
//           }}
//         />
//       </Head>

//       <NextSeo
//         canonical={`${baseUrl}/govtjobs`}
//         title={`${searchKeyword ? `${searchKeyword} Government Jobs` : 'Latest Government Job Notifications'}${(router.query.location && router.query.location !== "All") ? ` in ${router.query.location}` : ''} | Exameets`}
//         description={generateMetaDescription({
//           location: router.query.location || "All"
//         }, searchKeyword, totalJobs)}
//         openGraph={{
//           url: `${baseUrl}/govtjobs`,
//           title: `${searchKeyword ? `${searchKeyword} Government Jobs` : 'Latest Government Job Notifications'} | Exameets`,
//           description: generateMetaDescription({
//             location: router.query.location || "All"
//           }, searchKeyword, totalJobs),
//           images: [
//             {
//               url: `${baseUrl}/images/govtjobs-og.jpg`,
//               width: 1200,
//               height: 630,
//               alt: 'Government Jobs on Exameets',
//             }
//           ],
//         }}
//       />

//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-[#e6f4ff] dark:bg-gray-800 p-1.5 rounded-lg mb-8">
//             <div className="mb-2">
//               <h2 className="text-3xl ml-2 font-bold text-[#003366] dark:text-white">Government Jobs</h2>
//             </div>

//             {/* Mobile Layout */}
//             <div className="md:hidden">
//               <div className="flex gap-2 mb-6">
//                 <div className="flex-1 relative">
//                   <input
//                     id="govtjobs-search"
//                     name="govtjobs-search"
//                     type="text"
//                     placeholder="Search jobs..."
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     ref={searchInputRef}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                   />
//                   <FaSearch className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
//                 </div>
                
//                 {/* Location Dropdown */}
//                 <div className="relative" ref={locationDropdownRef}>
//                   <button
//                     onClick={() => {
//                       setShowLocationDropdown(!showLocationDropdown);
//                       setShowSortDropdown(false);
//                     }}
//                     className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     <MapPinCheck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//                   </button>
//                   {showLocationDropdown && (
//                     <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
//                       {locationOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => handleFilterChange('location', option.value)}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
//                             (router.query.location || 'All') === option.value
//                               ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                               : 'text-gray-700 dark:text-gray-200'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Sort Dropdown */}
//                 <div className="relative" ref={sortDropdownRef}>
//                   <button
//                     onClick={() => {
//                       setShowSortDropdown(!showSortDropdown);
//                       setShowLocationDropdown(false);
//                     }}
//                     className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
//                   >
//                     <ArrowDown10 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//                   </button>
//                   {showSortDropdown && (
//                     <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[150px]">
//                       {sortOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => handleFilterChange('sort', option.value)}
//                           className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg ${
//                             (router.query.sort || 'All') === option.value
//                               ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                               : 'text-gray-700 dark:text-gray-200'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Layout - Unchanged */}
//             <div className="hidden md:flex flex-col md:flex-row gap-4 mb-6">
//               <div className="flex-1">
//                 <div className="relative">
//                   <input
//                     id="govtjobs-search-desktop"
//                     name="govtjobs-search-desktop"
//                     type="text"
//                     placeholder="Search jobs..."
//                     value={searchKeyword}
//                     onChange={(e) => setSearchKeyword(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                   />
//                   <FaSearch className="absolute right-3 top-3 text-gray-400 dark:text-gray-300" />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   id="govtjobs-location"
//                   name="govtjobs-location"
//                   value={router.query.location || 'All'}
//                   onChange={(e) => handleFilterChange('location', e.target.value)}
//                   className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   <option value="All">All Cities</option>
//                   <option value="Ahmedabad">Ahmedabad</option>
//                   <option value="Bangalore">Bangalore</option>
//                   <option value="Chennai">Chennai</option>
//                   <option value="Delhi">Delhi</option>
//                   <option value="Hyderabad">Hyderabad</option>
//                   <option value="Kolkata">Kolkata</option>
//                   <option value="Mumbai">Mumbai</option>
//                   <option value="Pune">Pune</option>
//                 </select>
//                 <select
//                   id="govtjobs-sort"
//                   name="govtjobs-sort"
//                   value={router.query.sort || 'All'}
//                   onChange={(e) => handleFilterChange('sort', e.target.value)}
//                   className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   <option value="All">Sort by</option>
//                   <option value="recent">Recent First</option>
//                   <option value="deadline">Nearest Deadline</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {govtJobs.length === 0 ? (
//               <div className="col-span-full text-center py-10 text-gray-600 dark:text-gray-300">
//                 No items found matching your criteria. Try adjusting your filters or search term.
//               </div>
//             ) : (
//               govtJobs.map((job) => (
//                 <div 
//                   key={job._id} 
//                   className="grid grid-rows-[auto_auto_1fr_auto] bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-md hover:shadow-blue-250 dark:hover:shadow-blue-900/30 hover:scale-105 transition-all duration-300 ease-in-out relative h-full"
//                 >
//                   <h3 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2 min-h-[3.5rem] overflow-hidden">
//                     {job.jobTitle}
//                   </h3>
//                   <div className="text-md text-gray-600 dark:text-gray-300 pb-2 mb-3 border-b border-gray-200 dark:border-gray-600 line-clamp-2 overflow-hidden break-words">
//                     {job.organization}
//                   </div>
//                   <div className="grid gap-2 mb-4 overflow-hidden">
//                     {job.jobLocation && (
//                       <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden break-words">
//                         <span className="font-bold">Location:</span> {job.jobLocation}
//                       </div>
//                     )}
//                     {job.postNames && (
//                       <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
//                         <span className="font-bold">Post:</span> {Array.isArray(job.postNames) ? job.postNames.join(', ') : job.postNames}
//                       </div>
//                     )}
//                     {job.educationalQualifications && (
//                       <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden break-words">
//                         <span className="font-bold">Qualification:</span> {Array.isArray(job.educationalQualifications) ? job.educationalQualifications[0] : job.educationalQualifications}
//                       </div>
//                     )}
//                     {job.applicationStartDate && (
//                       <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
//                         <span className="font-bold">Start:</span> {job.applicationStartDate}
//                       </div>
//                     )}
//                     {job.applicationEndDate && (
//                       <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 overflow-hidden">
//                         <span className="font-bold">Close:</span> {job.applicationEndDate}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
//                     <span className="bg-[#015990] dark:bg-blue-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
//                       {job.totalVacancies ? `${job.totalVacancies} posts` : 'General'}
//                     </span>
//                     <Link 
//                       href={`/govtjobs/${job.slug}`}
//                       className="text-[#015990] dark:text-blue-400 font-bold hover:underline whitespace-nowrap ml-2 flex-shrink-0"
//                     >
//                       View Details <ArrowRight className="w-4 h-4 inline-block mb-1" />
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 my-8">
//               <button
//                 className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
//                   currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
//                 }`}
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
              
//               <div className="text-gray-600 dark:text-gray-300">
//                 Page {currentPage} of {totalPages}
//               </div>

//               <button
//                 className={`px-4 py-2 bg-[#015990] dark:bg-blue-600 text-white rounded ${
//                   currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
//                 }`}
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export async function getServerSideProps(context) {
//   await dbConnect();
//   try {
//     const { query, req } = context;
//     const { location, sort, searchKeyword, page = 1, limit = 8 } = query;

//     // Build query
//     const dbQuery = {};
//     if (location && location !== 'All') {
//       dbQuery.jobLocation = { $regex: location, $options: 'i' };
//     }

//     if (searchKeyword && searchKeyword.trim()) {
//       const searchTerm = searchKeyword.trim();
//       dbQuery.$or = [
//         { jobTitle: { $regex: searchTerm, $options: 'i' } },
//         { organization: { $regex: searchTerm, $options: 'i' } },
//         { jobOverview: { $regex: searchTerm, $options: 'i' } },
//         { 'postNames': { $regex: searchTerm, $options: 'i' } },
//         { 'keywords': { $regex: searchTerm, $options: 'i' } },
//         { 'educationalQualifications': { $regex: searchTerm, $options: 'i' } },
//         { 'additionalRequirements': { $regex: searchTerm, $options: 'i' } },
//         { 'selectionProcess': { $regex: searchTerm, $options: 'i' } },
//         { 'examSubjects': { $regex: searchTerm, $options: 'i' } }
//       ];
//     }

//     let sortOptions = { createdAt: -1 };
//     if (sort === 'recent') {
//       sortOptions = { createdAt: -1 };
//     } else if (sort === 'deadline') {
//       sortOptions = { applicationEndDate: 1 };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const totalJobs = await GovtJob.countDocuments(dbQuery);
//     const govtJobs = await GovtJob.find(dbQuery)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit))
//       .lean();

//     const formattedJobs = govtJobs.map(job => ({
//       ...job,
//       _id: job._id.toString(),
//       applicationStartDate: job.applicationStartDate,
//       applicationEndDate: job.applicationEndDate,
//       notificationReleaseDate: job.notificationReleaseDate,
//       examInterviewDate: job.examInterviewDate,
//       createdAt: job.createdAt ? job.createdAt.toString() : null,
//       updatedAt: job.updatedAt ? job.updatedAt.toString() : null,
//       postedBy: job.postedBy ? job.postedBy.toString() : null,
//       faq: job.faq?.map(faqItem => ({
//         ...faqItem,
//         _id: faqItem._id ? faqItem._id.toString() : null
//       })) || []
//     }));

//     // Add baseUrl logic
//     let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     if (!baseUrl && req) {
//       const protocol = req.headers['x-forwarded-proto'] || 'http';
//       const host = req.headers.host || 'localhost:3000';
//       baseUrl = `${protocol}://${host}`;
//     }

//     return {
//       props: {
//         govtJobs: formattedJobs,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalJobs / parseInt(limit)),
//         totalJobs,
//         baseUrl: baseUrl || 'http://localhost:3000'
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: error.message || 'Failed to load government jobs',
//         govtJobs: [],
//         currentPage: 1,
//         totalPages: 0,
//         totalJobs: 0,
//         baseUrl: 'http://localhost:3000'
//       },
//     };
//   }
// }

// export default GovtJobsPage;

import NotFound from "../404";
function GovtJobsPage({ res }) {
  if (res) {
    res.statusCode = 404; // mark it as a 404 response
  }
  return <NotFound />;
}

GovtJobsPage.getInitialProps = ({ res }) => {
  if (res) {
    res.statusCode = 404;
  }
  return {};
};

export default GovtJobsPage;