import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import dbConnect from "@/lib/dbConnect";
import { GovtJob } from "@/lib/models/GovtJob";
import { useRouter } from 'next/router';
import ShareModal from "@/modals/ShareModal";
import { FaShareAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

// Helper function for consistent date formatting
const formatDate = (dateString) => {
  if (!dateString) return 'Not specified';
  try {
    // Handle DD-MM-YYYY format from MongoDB
    if (typeof dateString === 'string' && dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Convert DD-MM-YYYY to MM/DD/YYYY for JavaScript Date constructor
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        const date = new Date(`${month}/${day}/${year}`);
        
        if (!isNaN(date.getTime())) {
          // Return in DD/MM/YYYY format
          return `${day}/${month}/${year}`;
        }
      }
    }
    
    // Fallback for other date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not specified';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Not specified';
  }
};

const renderArrayAsList = (array, emptyMessage = "None specified") => {
  if (!array || array.length === 0) {
    return <p className="text-gray-500 dark:text-white-400">{emptyMessage}</p>;
  }
  return (
    <ul className="list-disc pl-5 space-y-2">
      {array.map((item, index) => (
        <li key={index} className="text-gray-700 dark:text-gray-200">{item}</li>
      ))}
    </ul>
  );
};

const GovtJobDetails = ({ job, error }) => {
  const router = useRouter();
  const [showShare, setShowShare] = React.useState(false);

  const shareDetails = [
    job.organization && `Organization: ${job.organization}`,
    job.jobLocation && `Location: ${job.jobLocation}`,
    Array.isArray(job.postNames) && job.postNames.length > 0 && `Post: ${job.postNames.join(", ")}`
  ].filter(Boolean).join("\n");

  const handleKeywordClick = (keyword) => {
    router.push(`/govtjobs?page=1&searchKeyword=${encodeURIComponent(keyword)}`);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Back to Govt Jobs
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.exameets.in/govtjobs/${job.slug}`} />
        {/* Government Job Posting Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": job.jobTitle,
              "description": job.jobOverview,
              "datePosted": job.createdAt,
              "validThrough": job.applicationEndDate,
              "employmentType": "FULL_TIME",
              "hiringOrganization": {
                "@type": "Organization",
                "name": job.organization,
                "description": job.jobOverview,
                "sameAs": "https://www.exameets.in"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": job.jobLocation,
                  "addressCountry": "IN"
                }
              },
              "qualifications": job.educationalQualifications?.join(", "),
              "occupationalCategory": "Government",
              "jobBenefits": job.additionalRequirements?.join(", "),
              "applicationContact": job.applyOnlineLink ? undefined : {
                "@type": "ContactPoint",
                "url": job.officialWebsiteLink
              },
              "directApply": !!job.applyOnlineLink,
              "url": `https://www.exameets.in/govtjobs/${job.slug}`,
              // Government-specific properties
              "industry": "Government",
              "jobImmediateStart": false,
              "workHours": "Full-time",
              // Additional government job specific data
              "educationRequirements": job.educationalQualifications?.join(", "),
              "experienceRequirements": job.additionalRequirements?.join(", "),
              "skills": job.keywords?.join(", ")
            })
          }}
        />
      </Head>
      <NextSeo
        title={`${job.jobTitle} | ${job.organization} | Government Job Details`}
        description={job.jobOverview?.substring(0, 150) || `${job.jobTitle} government job at ${job.organization}. Apply online for this govt recruitment opportunity.`}
        canonical={`https://www.exameets.in/govtjobs/${job.slug}`}
        openGraph={{
          url: `https://www.exameets.in/govtjobs/${job.slug}`,
          title: `${job.jobTitle} | ${job.organization} | Government Job Details`,
          description: job.jobOverview?.substring(0, 150) || `${job.jobTitle} government job at ${job.organization}. Apply online for this govt recruitment opportunity.`,
          images: [
            {
              url: `https://www.exameets.in/api/og/govtjob/${job.slug}`,
              width: 1200,
              height: 630,
              alt: `${job.jobTitle} at ${job.organization}`,
            },
          ],
          type: 'article',
          article: {
            publishedTime: job.createdAt,
            modifiedTime: job.updatedAt || job.createdAt,
            section: 'Government Jobs',
            tags: job.keywords || []
          }
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              job.jobTitle,
              job.organization,
              'government job',
              'govt recruitment',
              'sarkari naukri',
              ...(job.keywords || [])
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

      <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 inline-block" /> Back to Govt Jobs
          </button>
          <button
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => setShowShare(true)}
            aria-label="Share"
          >
            <FaShareAlt className="text-[#015990] dark:text-blue-400" size={22} />
          </button>
        </div>

        <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col relative">

          <h1 className="text-xl font-bold text-white text-center">
            {job.jobTitle || "Government Job"}
          </h1>

          <p className="mt-2 text-15px text-[#ececec] text-center">
            {job.organization || "Not specified"}
          </p>
        </div>

        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`https://www.exameets.in${router.asPath}`}
          title={job.jobTitle || "Government Job"}
          details={shareDetails}
        />
        {/* Job Overview */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Job Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{job.jobOverview || "No overview available"}</p>
          
          {job.notification_about && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Notification About</h3>
              <p className="text-gray-700 dark:text-gray-300">{job.notification_about}</p>
            </div>
          )}
          
          {job.year && (
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Year</h3>
              <p className="text-gray-700 dark:text-gray-300">{job.year}</p>
            </div>
          )}
        </section>

        {/* Job Location & Vacancies */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Job Location</h2>
          <p className="text-gray-700 dark:text-gray-300">{job.jobLocation || "Not specified"}</p>
        </section>
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Total Vacancies</h2>
          <p className="text-gray-700 dark:text-gray-300">{job.totalVacancies || "Not specified"}</p>
          
          {Array.isArray(job.postNames) && job.postNames.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Post Names</h3>
              {renderArrayAsList(job.postNames)}
            </div>
          )}
        </section>

        {/* Important Dates */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
          <ul className="space-y-3">
            {[
              ['Notification Release Date',job.notificationReleaseDate],
              ['Application Start Date',job.applicationStartDate],
              ['Application End Date',job.applicationEndDate],
              ['Exam/Interview Date',job.examInterviewDate],
            ].map(([label, date], index) => (
              <li
                key={index}
                className={`flex justify-between items-center ${index < 3 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
              >
                <span className="font-bold">{label}:</span>
                <span>{date}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Eligibility Criteria */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Educational Qualifications</h3>
              {renderArrayAsList(job.educationalQualifications)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Age Limit</h3>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p>Minimum: {job.ageLimitMin || "Not specified"}</p>
                <p>Maximum: {job.ageLimitMax || "Not specified"}</p>
                <p>Age Relaxation: {job.ageRelaxation || "Not specified"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Additional Requirements</h3>
              {renderArrayAsList(job.additionalRequirements)}
            </div>
          </div>
        </section>

        {/* Vacancy Details (if post-specific data is available) */}
        {Array.isArray(job.vacancyPostNames) && job.vacancyPostNames.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Vacancy Details</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-center">Post Name</th>
                  <th className="px-4 py-2 text-center">Vacancy Count</th>
                  <th className="px-4 py-2 text-center">Pay Scale</th>
                </tr>
              </thead>
              <tbody>
                {job.vacancyPostNames.map((postName, index) => (
                  <tr key={index} className="border-t border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-center">{postName}</td>
                    <td className="px-4 py-2 text-center">{job.vacancyCounts?.[index]}</td>
                    <td className="px-4 py-2 text-center">{job.vacancyPayScales?.[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Application Details */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Application Details</h2>
          <ul className="space-y-3">
            {[
              ['Application Mode', job.applicationMode],
              ['Application Fee (General)', job.applicationFeeGeneral],
              ['Application Fee (SC/ST/PWD)', job.applicationFee_SC_ST_PWD],
              ['Payment Mode', job.applicationFeePaymentMode],
            ].map(([label, value], index) => (
              <li
                key={index}
                className={`flex justify-between items-center ${index < 3 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
              >
                <span className="font-bold">{label}:</span>
                <span>{value || "Not specified"}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Selection Process */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Selection Process</h2>
          {renderArrayAsList(job.selectionProcess)}
        </section>

        {/* How to Apply */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">How to Apply</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold dark:text-white mb-2">Online Application Steps</h3>
              {renderArrayAsList(job.howToApplyOnlineSteps)}
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-white mb-2">Offline Application Steps</h3>
              {renderArrayAsList(job.howToApplyOfflineSteps)}
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-white mb-2">Required Documents</h3>
              {renderArrayAsList(job.requiredDocuments)}
            </div>
          </div>
        </section>

{/* Exam Details */}
{Array.isArray(job.examSubjects) && job.examSubjects.length > 0 && (
  <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">
      Exam Details
    </h2>

    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 text-left break-words whitespace-normal">Exam Subject</th>
            <th className="px-4 py-2 text-left break-words whitespace-normal">Question Count</th>
            <th className="px-4 py-2 text-left break-words whitespace-normal">Marks Distribution</th>
            <th className="px-4 py-2 text-left break-words whitespace-normal">Exam Duration</th>
          </tr>
        </thead>
        <tbody>
          {job.examSubjects.map((subject, index) => (
            <tr
              key={index}
              className="border-t border-b border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-2 break-words whitespace-normal">
                {subject}
              </td>
              <td className="px-4 py-2 break-words whitespace-normal">
                {job.examQuestionCounts?.[index]}
              </td>
              <td className="px-4 py-2 break-words whitespace-normal">
                {job.examMarks?.[index]}
              </td>
              <td className="px-4 py-2 break-words whitespace-normal">
                {job.examDurations?.[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}


        {/* Important Links */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Links</h2>
          <ul className="space-y-3">
            {job.notificationPDFLink && (
              <li className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                <span className="font-bold">Notification PDF:</span>
                <a href={job.notificationPDFLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </li>
            )}
            {job.applyOnlineLink && (
              <li className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                <span className="font-bold">Apply Online:</span>
                <a href={job.applyOnlineLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </li>
            )}
            {job.officialWebsiteLink && (
              <li className="flex justify-between items-center">
                <span className="font-bold">Official Website:</span>
                <a href={job.officialWebsiteLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </li>
            )}
          </ul>
        </section>

        {/* FAQ */}
        {Array.isArray(job.faq) && job.faq.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {job.faq.map((item, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <strong className="text-gray-800 dark:text-gray-200 flex-shrink-0">Q:</strong>
                    <span className="font-semibold">{item.question}</span>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <strong className="text-gray-800 dark:text-gray-200 flex-shrink-0">A:</strong>
                    <span>{item.answer}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Keywords */}
        {Array.isArray(job.keywords) && job.keywords.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {job.keywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Featured Badge */}
        {job.isFeatured && (
          <div className="absolute top-6 right-16 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Featured Job
          </div>
        )}

        {/* Apply Button */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 text-center">
        {job.applyOnlineLink && (
          <div className="text-center">
            <a
              href={job.applyOnlineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Apply Now
            </a>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              You will be redirected to the official application portal.
            </p>
          </div>
        )}
        </section>
        
      </div>
    </>
  );
};


export async function getServerSideProps(context) {
  await dbConnect();
  const { slug } = context.params;

  try {
    const job = await GovtJob.findOne({ slug }).lean();
    
    if (!job) {
      return { notFound: true };
    }

    // Convert ObjectId and other non-serializable fields
    const formattedJob = {
      ...job,
      _id: job._id ? job._id.toString() : null,
      faq: job.faq?.map(faqItem => ({
        ...faqItem,
        _id: faqItem._id ? faqItem._id.toString() : null
      })) || [],
      createdAt: job.createdAt ? job.createdAt.toString() : null,
      postedBy: job.postedBy ? job.postedBy.toString() : null
    };

    // Format date fields - keep original values, let formatDate handle conversion
    const dateFields = [
      'notificationReleaseDate',
      'applicationStartDate', 
      'applicationEndDate',
      'examInterviewDate'
    ];
    
    dateFields.forEach(field => {
      // Don't format here, pass the original value to the component
      formattedJob[field] = job[field] || null;
    });

    return {
      props: {
        job: formattedJob,
      },
    };
  } catch (error) {
    console.error('Error fetching job details:', error);
    return {
      props: {
        error: error.message || "Failed to load job details",
      },
    };
  }
}

export default GovtJobDetails;