import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { FaArrowLeft , FaShareAlt} from "react-icons/fa";
import dbConnect from "@/lib/dbConnect";
import { Internship } from "@/lib/models/Internship";
import ShareModal from "@/modals/ShareModal";
import { useRouter } from "next/router";

// Helper function to format dates in a fixed MM/DD/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

// Change component signature
const InternshipDetails = ({ internship, error, baseUrl }) => {
  const router = useRouter();
  const [showShare, setShowShare] = React.useState(false);

  const shareDetails = [
    internship.organization && `Organization: ${internship.organization}`,
    internship.location && `Location: ${internship.location}`,
  ].filter(Boolean).join("\n");


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto p-6">Error: {error}</div>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto p-6">No internship found</div>
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
      <Head>
        <link rel="canonical" href={`${baseUrl}/internships/${internship.slug}`} />
        {/* Enhanced Internship Job Posting Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": internship.title,
              "description": internship.description || `${internship.title} internship opportunity at ${internship.organization}`,
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
              },
              "workHours": internship.duration,
              "qualifications": internship.eligibility_criteria?.join(', '),
              "skills": internship.skills_required?.join(', '),
              "applicationDeadline": internship.last_date,
              "url": `${baseUrl}/internships/${internship.slug}`
            })
          }}
        />
      </Head>

      <NextSeo
        title={`${internship.title} | ${internship.organization} | Internship Opportunity`}
        description={internship.description?.substring(0, 150) || `Join ${internship.title} internship at ${internship.organization}. Location: ${internship.location}. Duration: ${internship.duration}. Apply now!`}
        canonical={`${baseUrl}/internships/${internship.slug}`}
        openGraph={{
          url: `${baseUrl}/internships/${internship.slug}`,
          title: `${internship.title} | ${internship.organization} | Internship Opportunity`,
          description: internship.description?.substring(0, 150) || `Join ${internship.title} internship at ${internship.organization}. Location: ${internship.location}. Duration: ${internship.duration}. Apply now!`,
          images: [
            {
              url: `${baseUrl}/api/og/internship/${internship.slug}`,
              width: 1200,
              height: 630,
              alt: `${internship.title} Internship`,
            },
          ],
          type: 'article',
          article: {
            publishedTime: internship.createdAt,
            section: 'Internships',
            tags: [
              'internship',
              'career opportunity',
              internship.organization,
              internship.location,
              internship.field,
              ...(internship.skills_required || [])
            ]
          }
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              internship.title,
              internship.organization,
              internship.location,
              internship.field,
              'internship',
              'student opportunity',
              'career development',
              'professional experience',
              ...(internship.skills_required || [])
            ].filter(Boolean).join(', ')
          },
          {
            name: 'author',
            content: 'Exameets'
          },
          {
            property: 'article:author',
            content: 'Exameets'
          },
          {
            name: 'internship-type',
            content: internship.internship_type
          },
          {
            name: 'location',
            content: internship.location
          },
          {
            name: 'organization',
            content: internship.organization
          }
        ]}
      />

      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft /> Back to Internships
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
            {internship.title || "Internship Title"}
          </h1>

          <p className="mt-2 text-15px text-[#ececec] text-center">
            {internship.organization || "Not specified"}
          </p>
        </div>

        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`https://www.exameets.in${router.asPath}`}
          title={internship.title || "Internship Title"}
          details={shareDetails}
        />

      {/* Organization Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Organization Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Location</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.location || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Field</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.field || 'Not specified'}</p>
          </div>
        </div>
      </section>

      {/* Internship Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Internship Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Type</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.internship_type || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Duration</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.duration || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Stipend</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.stipend || 'Not specified'}</p>
          </div>
        </div>
      </section>

      {/* Skills Required */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Skills Required</h2>
        <ul className="list-disc pl-5 space-y-2">
          {internship.skills_required?.length > 0 ? 
            internship.skills_required.map((skill, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{skill}</li>
            )) : 
            <p className="text-gray-500 dark:text-gray-400">No specific skills mentioned</p>
          }
        </ul>
      </section>

      {/* Description */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{internship.description || 'No description available'}</p>
      </section>

      {/* Eligibility Criteria */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
        <ul className="list-disc pl-5 space-y-2">
          {internship.eligibility_criteria?.length > 0 ? 
            internship.eligibility_criteria.map((criteria, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">{criteria}</li>
            )) : 
            <p className="text-gray-500 dark:text-gray-400">No eligibility criteria mentioned</p>
          }
        </ul>
      </section>

      {/* Important Dates */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
        <div className="space-y-3">
          <div className="rounded-lg flex justify-between items-center">
            <p className="text-gray-800 dark:text-gray-200">Start Date</p>
            <p className="text-gray-700 dark:text-gray-300">
              {internship.start_date ? internship.start_date : 'Not specified'}
            </p>
          </div>
          <div className="rounded-lg flex justify-between items-center">
            <p className=" text-gray-800 dark:text-gray-200">Last Date to Apply</p>
            <p className="text-gray-700 dark:text-gray-300">
              {internship.last_date ? internship.last_date : 'Not specified'}
            </p>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        {/* <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Apply</h2> */}
        <div className="rounded-lg text-center">
          <a
            href={internship.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
};

// Replace the entire getServerSideProps function
export async function getServerSideProps(context) {
  const { slug } = context.query;
  const { req } = context;
  
  await dbConnect();
  
  try {
    const internship = await Internship.findOne({ slug }).lean();
    
    if (!internship) {
      return { notFound: true };
    }
    
    // Serialize data similar to other pages
    const serializedInternship = JSON.parse(JSON.stringify(internship, (key, value) => {
      return key === '_id' ? value.toString() : value;
    }));
    
    // Generate canonical URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl && req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      baseUrl = `${protocol}://${host}`;
    }
    
    return { 
      props: { 
        internship: serializedInternship,
        baseUrl: baseUrl || 'http://localhost:3000'
      } 
    };
  } catch (error) {
    return { 
      props: { 
        error: error.message || "Error fetching internship",
        baseUrl: 'http://localhost:3000'
      } 
    };
  }
}

export default InternshipDetails;