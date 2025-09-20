import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { FaShareAlt } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import dbConnect from "@/lib/dbConnect";
import { Admission } from "@/lib/models/Admission";
import ShareModal from "@/modals/ShareModal";
import { useRouter } from "next/router";


// Helper function to format dates in a fixed MM/DD/YYYY format
const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const AdmissionDetails = ({ admission, error }) => {
  const router = useRouter();
  const [showShare, setShowShare] = React.useState(false);

  const shareDetails = [
    admission.institute && `Institute: ${admission.institute}`,
    admission.location && `Location: ${admission.location}`,
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

  if (!admission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto p-6">No admission found</div>
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
        <link
          rel="canonical"
          href={`https://www.exameets.in/admissions/${admission.slug}`}
        />
        {/* Admission Event Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": admission.title,
              "description": admission.description,
              "startDate": admission.start_date,
              "endDate": admission.last_date,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": admission.institute,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": admission.location?.split(',')[0]?.trim(),
                  "addressRegion": admission.location?.split(',')[1]?.trim() || "India",
                  "addressCountry": "IN"
                }
              },
              "organizer": {
                "@type": "Organization",
                "name": admission.institute,
                "url": "https://www.exameets.in"
              },
              "offers": {
                "@type": "Offer",
                "name": `${admission.title} Application`,
                "price": admission.fees === "N/A" ? "0" : admission.fees,
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "validFrom": admission.start_date,
                "validThrough": admission.last_date,
                "url": admission.application_link
              },
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student"
              },
              "educationalLevel": admission.category,
              "courseMode": "full-time",
              "url": `https://www.exameets.in/admissions/${admission.slug}`,
              // Additional educational properties
              "about": {
                "@type": "Course",
                "name": admission.course,
                "description": admission.description,
                "provider": {
                  "@type": "Organization",
                  "name": admission.institute
                }
              }
            })
          }}
        />
      </Head>
      <NextSeo
        title={`${admission.title} | ${admission.institute} | Admission Details`}
        description={
          admission.description?.substring(0, 150) ||
          `${admission.title} admission at ${admission.institute}. Application deadline: ${formatDate(admission.last_date)}. Apply online now.`
        }
        canonical={`https://www.exameets.in/admissions/${admission.slug}`}
        openGraph={{
          url: `https://www.exameets.in/admissions/${admission.slug}`,
          title: `${admission.title} | ${admission.institute} | Admission Details`,
          description:
            admission.description?.substring(0, 150) ||
            `${admission.title} admission at ${admission.institute}. Application deadline: ${formatDate(admission.last_date)}. Apply online now.`,
          images: [
            {
              url: `https://www.exameets.in/api/og/admission/${admission.slug}`,
              width: 1200,
              height: 630,
              alt: `${admission.title} at ${admission.institute}`,
            },
          ],
          type: 'article',
          article: {
            publishedTime: admission.createdAt,
            modifiedTime: admission.updatedAt || admission.createdAt,
            section: 'College Admissions',
            tags: [admission.category, admission.course, ...(admission.keywords || [])]
          }
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: [
              admission.title,
              admission.institute,
              admission.course,
              admission.category,
              'college admission',
              'university admission',
              'admission notification',
              'college application',
              ...(admission.keywords || [])
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
            name: 'application-deadline',
            content: admission.last_date
          },
          {
            name: 'application-start',
            content: admission.start_date
          }
        ]}
      />

      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 inline-block" /> Back to Admissions
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
        <section className="border-gray-200 pb-3">
          <h1 className="text-xl font-bold text-white text-center">
            {admission.title || "Admission Details"}
          </h1>
        </section>
          
          <p className="mt-2 text-15px text-[#ececec] text-center">
            {admission.institute || "Not specified"}
          </p>
        </div>

        <ShareModal
          open={showShare}
          onClose={() => setShowShare(false)}
          url={`https://www.exameets.in${router.asPath}`}
          title={admission.title || "Admission Details"}
          details={shareDetails}
        />

      {/* Main Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Location</h2>
            <p className="text-gray-700 dark:text-gray-300">{admission.location || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Category</h2>
            <p className="text-gray-700 dark:text-gray-300">{admission.category || "N/A"}</p>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {admission.description || "N/A"}
        </p>
      </section>

      {/* Course & Fees */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Course</h2>
            <p className="text-gray-700 dark:text-gray-300">{admission.course || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Fees</h2>
            <p className="text-gray-700 dark:text-gray-300">{admission.fees || "N/A"}</p>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {admission.eligibility_criteria || "N/A"}
        </p>
      </section>

      {/* Important Dates */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
        <ul className="space-y-3">
          {[
            ['Start Date', admission.start_date],
            ['Last Date', admission.last_date],
            ['Posted Date', admission.post_date],
          ].map(([label, date], index) => (
            <li
              key={index}
              className={`flex justify-between items-center ${index < 2 ? 'border-b pb-2 border-gray-200 dark:border-gray-700' : ''}`}
            >
              <span className="font-bold">{label}:</span>
              <span>{(date)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Application Process */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        {/* <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Application Process</h2> */}
        <div className="p-4 rounded-lg text-center">
          <a
            href={admission.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Featured Badge */}
      {admission.is_featured && (
        <div className="absolute top-6 right-16 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          Featured Admission
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  await dbConnect();
  try {
    const admission = await Admission.findOne({ slug }).lean();
    if (!admission) {
      return { notFound: true };
    }
    
    // Convert MongoDB _id to string and handle date serialization
    const serializedAdmission = JSON.parse(JSON.stringify(admission, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    
    return { 
      props: { 
        admission: serializedAdmission,
      } 
    };
  } catch (error) {
    return { props: { error: error.message || "Error fetching admission" } };
  }
}

export default AdmissionDetails;