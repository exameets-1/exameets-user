import React from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { FaArrowLeft } from "react-icons/fa";
import dbConnect from "@/lib/dbConnect";
import { Internship } from "@/lib/models/Internship";

// Helper function to format dates in a fixed MM/DD/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const InternshipDetails = ({ internship, error }) => {
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
        <link
          rel="canonical"
          href={`https://exameets.in/internships/${internship.slug}`}
        />
      </Head>
      <NextSeo
        title={`${internship.title} | Exameets`}
        description={internship.description || "Internship details"}
        canonical={`https://exameets.in/internships/${internship.slug}`}
        openGraph={{
          url: `https://exameets.in/internships/${internship.slug}`,
          title: `${internship.title} | Exameets`,
          description: internship.description || "Internship details",
          images: [
            {
              url: internship.image_url || "https://exameets.in/images/logo-final.webp",
              width: 1200,
              height: 630,
              alt: "Internship Banner",
            },
          ],
        }}
      />

      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FaArrowLeft /> Back to Internships
        </button>
      </div>

      <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold text-white text-center">{internship.title}</h1>
        <p className="mt-2 text-xl text-white text-center">{internship.organization}</p>
      </div>

      {/* Organization Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Organization Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Location</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.location || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Field</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.field || 'Not specified'}</p>
          </div>
        </div>
      </section>

      {/* Internship Details */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Internship Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Type</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.internship_type || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Duration</h3>
            <p className="text-gray-700 dark:text-gray-300">{internship.duration || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Stipend</h3>
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
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <p className="font-medium text-gray-800 dark:text-gray-200">Start Date</p>
            <p className="text-gray-700 dark:text-gray-300">
              {internship.start_date ? formatDate(internship.start_date) : 'Not specified'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <p className="font-medium text-gray-800 dark:text-gray-200">Last Date to Apply</p>
            <p className="text-gray-700 dark:text-gray-300">
              {internship.last_date ? formatDate(internship.last_date) : 'Not specified'}
            </p>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">How to Apply</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <a
            href={internship.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  await dbConnect();
  try {
    const internship = await Internship.findOne({ slug }).lean();
    if (!internship) {
      return { notFound: true };
    }
    
    // Convert MongoDB _id to string and handle date serialization
    const serializedInternship = JSON.parse(JSON.stringify(internship, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }));
    
    return { props: { internship: serializedInternship } };
  } catch (error) {
    return { props: { error: error.message || "Error fetching internship" } };
  }
}

export default InternshipDetails;