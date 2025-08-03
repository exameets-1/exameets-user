import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from 'next/router';
import dbConnect from "@/lib/dbConnect";
import { Job } from "@/lib/models/Job";

// Helper function to format dates consistently (MM/DD/YYYY)
const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const JobDetails = ({ job, error }) => {
  const router = useRouter();

  // Function to handle keyword clicks
  const handleKeywordClick = (keyword) => {
    router.push(`/jobs?q=${encodeURIComponent(keyword)}&page=1`);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p>Job not found</p>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Helper function to render array fields as lists
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

  return (
    <div className="relative max-w-6xl mx-auto">
      <Head>
        <link rel="canonical" href={`https://exameets.com/jobs/${job.slug}`} />
      </Head>
      <NextSeo
        title={`${job.jobTitle} | ${job.companyName} | Job Details`}
        description={job.positionSummary}
        canonical={`https://exameets.com/jobs/${job.slug}`}
        openGraph={{
          url: `https://exameets.com/jobs/${job.slug}`,
          title: `${job.jobTitle} | ${job.companyName} | Job Details`,
          description: job.positionSummary,
        }}
      />

      <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
        >
          ← Back to Jobs
        </button>

        <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
          <h1 className="text-2xl font-bold text-white text-center">{job.jobTitle}</h1>
          <p className="mt-2 text-white text-center">{job.companyName}</p>
        </div>

        {/* Category & Position Type */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Category</h2>
              <p className="text-gray-700 dark:text-gray-300">{job.category}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Position Type</h2>
              <p className="text-gray-700 dark:text-gray-300">{job.positionType}</p>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Location</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {job.city}, {job.state}, {job.country}
          </p>
        </section>

        {/* Company Overview */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Company Overview</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.companyOverview}</p>
        </section>

        {/* Position Summary */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Position Summary</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.positionSummary}</p>
        </section>

        {/* Key Responsibilities */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Key Responsibilities</h2>
          {renderArrayAsList(job.keyResponsibilities)}
        </section>

        {/* Experience & Education */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Experience Required</h2>
              <p className="text-gray-700 dark:text-gray-300">{job.experience}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Education Requirements</h2>
              {renderArrayAsList(job.education)}
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Technical Skills</h2>
          <div className="space-y-6">
            {job.languages?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Languages</h3>
                {renderArrayAsList(job.languages)}
              </div>
            )}
            {job.frameworks?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Frameworks</h3>
                {renderArrayAsList(job.frameworks)}
              </div>
            )}
            {job.databases?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Databases</h3>
                {renderArrayAsList(job.databases)}
              </div>
            )}
            {job.methodologies?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Methodologies</h3>
                {renderArrayAsList(job.methodologies)}
              </div>
            )}
          </div>
        </section>

        {/* Soft Skills */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Soft Skills</h2>
              {renderArrayAsList(job.softSkills)}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Benefits</h2>
          {renderArrayAsList(job.benefits)}
        </section>

        {/* Preferred Qualifications */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Preferred Qualifications</h2>
          {renderArrayAsList(job.preferredQualifications)}
        </section>

        {/* Important Dates */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
          <ul className="space-y-3">
            {job.startDate && (
              <li className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
                <span className="font-medium">Start Date:</span>
                <span>{job.startDate}</span>
              </li>
            )}
            <li className="flex justify-between items-center">
              <span className="font-medium">Application Deadline:</span>
              <span>{job.applicationDeadline}</span>
            </li>
          </ul>
        </section>

        {/* Reference Number */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Reference Number</h2>
              <p className="text-gray-700 dark:text-gray-300">{job.jobReferenceNumber}</p>
            </div>
          </div>
        </section>

        {/* Equal Opportunity */}
        <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Equal Opportunity</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.equalOpportunityStatement}</p>
        </section>

        {/* FAQ */}
        {job.faq?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {job.faq.map((item) => (
                <li key={item._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <strong className="text-gray-800 dark:text-gray-200">Q:</strong> {item.question}<br />
                  <strong className="text-gray-800 dark:text-gray-200 mt-2 block">A:</strong> {item.answer}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Keywords */}
        {Array.isArray(job.keywords) && job.keywords.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
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

        {/* Application Section */}
        <section className="mb-8">
          {job.submissionMethod === 'email' ? (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                To apply, please send your resume to: {' '}
                <a href={`mailto:${job.contactEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {job.contactEmail}
                </a>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <a
                href={job.applicationPortalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Apply Now
              </a>
            </div>
          )}
        </section>

        {/* Featured Badge */}
        {job.isFeatured && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Featured Job
          </div>
        )}

        {/* FAQ */}
        {job.faq?.length > 0 && (
          <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {job.faq.map((item) => (
                <li key={item._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <strong className="text-gray-800 dark:text-gray-200">Q:</strong> {item.question}<br />
                  <strong className="text-gray-800 dark:text-gray-200 mt-2 block">A:</strong> {item.answer}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await dbConnect();
  const { slug } = context.params;

  try {
    const job = await Job.findOne({ slug }).lean();
    
    if (!job) return { notFound: true };

    // Serialize the job object
    const serializedJob = JSON.parse(JSON.stringify(job));
    serializedJob._id = job._id.toString();
    
    return { props: { job: serializedJob } };
  } catch (error) {
    return { props: { error: error.message } };
  }
}

export default JobDetails;