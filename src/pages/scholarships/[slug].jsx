import React from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { 
    FaArrowLeft,
    FaMapMarker
} from 'react-icons/fa';
import dbConnect from '@/lib/dbConnect';
import { Scholarship } from '@/lib/models/Scholarship';

const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}; 

const ScholarshipDetails = ({ scholarship, error }) => {
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

    if (!scholarship) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <p>No scholarship details found</p>
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
        <>
            <Head>
                <link rel="canonical" href={`https://exameets.com/scholarships/${scholarship.slug}`} />
            </Head>
            <NextSeo
                title={`${scholarship.title || "Scholarship Details"} | Exameets`}
                description={scholarship.description || ""}
                openGraph={{
                    type: "website",
                    url: `https://exameets.com/scholarships/${scholarship.slug}`,
                    title: `${scholarship.title || "Scholarship Details"} | Exameets`,
                    description: scholarship.description || "",
                    images: [
                        {
                            url: "https://exameets.com/images/logo.png",
                            width: 800,
                            height: 600,
                            alt: "Exameets Scholarship",
                        },
                    ],
                }}
            />
            <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
                <div className="flex justify-between items-start mb-6">
                    <button 
                        onClick={() => window.history.back()} 
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <FaArrowLeft /> Back to Scholarships
                    </button>
                </div>

                <div className="bg-[#015590] dark:bg-[#013b64] rounded-t-lg p-4 mb-6 flex items-center justify-center flex-col">
                    <h1 className="text-4xl font-bold text-white text-center">{scholarship.title || "Scholarship Details"}</h1>
                    <p className="mt-2 text-2xl font-mono text-white text-center">{scholarship.organization || "Not specified"}</p>
                </div>

                {/* Scholarship Details */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Scholarship Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Qualification</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.qualification || 'Not specified'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Category</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.category || 'Not specified'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Amount</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.amount || 'Not specified'}</p>
                        </div>
                        {scholarship.is_featured && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Featured</h3>
                                <p className="text-gray-700 dark:text-gray-300">Yes</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Description */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">About the Scholarship</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{scholarship.description || "No description available"}</p>
                </section>

                {/* Eligibility Criteria */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Eligibility Criteria</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {scholarship.eligibility_criteria || 'No specific eligibility criteria listed'}
                    </p>
                </section>

                {/* Location Details */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Location Details</h2>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FaMapMarker className="text-blue-600 dark:text-blue-400" />
                            {scholarship.country || "Not specified"}
                        </p>
                    </div>
                </section>

                {/* Important Dates */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Important Dates</h2>
                    <div className="space-y-3">
                        {scholarship.start_date && (
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <p className="font-medium text-gray-800 dark:text-gray-200">Start Date</p>
                                <p className="text-gray-700 dark:text-gray-300">{formatDate(scholarship.start_date)}</p>
                            </div>
                        )}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-medium text-gray-800 dark:text-gray-200">Posted Date</p>
                            <p className="text-gray-700 dark:text-gray-300">{formatDate(scholarship.post_date)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-medium text-gray-800 dark:text-gray-200">Last Date to Apply</p>
                            <p className="text-gray-700 dark:text-gray-300">{formatDate(scholarship.last_date)}</p>
                        </div>
                    </div>
                </section>

                {/* How to Apply */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">How to Apply</h2>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <a
                            href={scholarship.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300"
                        >
                            Apply Now
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
};

export const getServerSideProps = async (context) => {
    await dbConnect();
    const { slug } = context.params;

    try {
        const scholarshipDoc = await Scholarship.findOne({ slug }).lean();

        if (!scholarshipDoc) {
            return { notFound: true };
        }

        // Convert all Date objects and ObjectIDs to strings
        const processedScholarship = {
            ...scholarshipDoc,
            _id: scholarshipDoc._id.toString(),
            postedBy: scholarshipDoc.postedBy ? scholarshipDoc.postedBy.toString() : null,
            createdAt: scholarshipDoc.createdAt.toISOString(),
            // Handle date fields that might be strings or Date objects
            post_date: scholarshipDoc.post_date ? 
                new Date(scholarshipDoc.post_date).toISOString() : 
                null,
            last_date: scholarshipDoc.last_date ? 
                new Date(scholarshipDoc.last_date).toISOString() : 
                null,
            start_date: scholarshipDoc.start_date ? 
                new Date(scholarshipDoc.start_date).toISOString() : 
                null,
        };

        // Remove MongoDB-specific properties
        delete processedScholarship.__v;

        return {
            props: {
                scholarship: processedScholarship
            }
        };
    } catch (error) {
        return { 
            props: { 
                error: error.message || "Error fetching scholarship details" 
            } 
        };
    }
};

export default ScholarshipDetails;