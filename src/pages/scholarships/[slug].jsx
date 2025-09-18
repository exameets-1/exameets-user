import React from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { 
    FaArrowLeft,
    FaMapMarker,
    FaShareAlt
} from 'react-icons/fa';
import dbConnect from '@/lib/dbConnect';
import { Scholarship } from '@/lib/models/Scholarship';
import ShareModal from '@/modals/ShareModal';

const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}; 

// Change component signature
const ScholarshipDetails = ({ scholarship, error, baseUrl }) => {
    const router = useRouter();
    const [showShare, setShowShare] = React.useState(false);

    const shareDetails = [
        scholarship.organization && `Organization: ${scholarship.organization}`,
        scholarship.qualification && `Qualification: ${scholarship.qualification}`,
    ].filter(Boolean).join("\n");

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
                <link rel="canonical" href={`${baseUrl}/scholarships/${scholarship.slug}`} />
                {/* Enhanced Scholarship Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Scholarship",
                            "name": scholarship.title,
                            "description": scholarship.description || `${scholarship.title} scholarship opportunity by ${scholarship.organization}`,
                            "provider": {
                                "@type": "Organization",
                                "name": scholarship.organization
                            },
                            "awardAmount": {
                                "@type": "MonetaryAmount",
                                "value": scholarship.amount,
                                "currency": "INR"
                            },
                            "eligibilityCriteria": scholarship.eligibility_criteria,
                            "applicationDeadline": scholarship.last_date,
                            "datePosted": scholarship.createdAt,
                            "scholarshipCategory": scholarship.category,
                            "educationalLevel": scholarship.qualification,
                            "availableAtOrFrom": {
                                "@type": "Place",
                                "name": scholarship.country || "India",
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressCountry": scholarship.country || "IN"
                                }
                            },
                            "url": `${baseUrl}/scholarships/${scholarship.slug}`
                        })
                    }}
                />
            </Head>

            <NextSeo
                title={`${scholarship.title} | ${scholarship.organization} | Scholarship Opportunity`}
                description={scholarship.description?.substring(0, 150) || `Apply for ${scholarship.title} scholarship by ${scholarship.organization}. Amount: ${scholarship.amount}. Category: ${scholarship.category}. Apply now!`}
                canonical={`${baseUrl}/scholarships/${scholarship.slug}`}
                openGraph={{
                    url: `${baseUrl}/scholarships/${scholarship.slug}`,
                    title: `${scholarship.title} | ${scholarship.organization} | Scholarship Opportunity`,
                    description: scholarship.description?.substring(0, 150) || `Apply for ${scholarship.title} scholarship by ${scholarship.organization}. Amount: ${scholarship.amount}. Category: ${scholarship.category}. Apply now!`,
                    images: [
                        {
                            url: `${baseUrl}/api/og/scholarship/${scholarship.slug}`,
                            width: 1200,
                            height: 630,
                            alt: `${scholarship.title} Scholarship`,
                        },
                    ],
                    type: 'article',
                    article: {
                        publishedTime: scholarship.createdAt,
                        section: 'Scholarships',
                        tags: [
                            'scholarship',
                            'educational funding',
                            'financial aid',
                            scholarship.organization,
                            scholarship.category,
                            scholarship.qualification,
                            scholarship.country
                        ]
                    }
                }}
                additionalMetaTags={[
                    {
                        name: 'keywords',
                        content: [
                            scholarship.title,
                            scholarship.organization,
                            scholarship.category,
                            scholarship.qualification,
                            scholarship.country,
                            'scholarship',
                            'educational funding',
                            'financial aid',
                            'student support',
                            'merit scholarship',
                            'need based scholarship'
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
                        name: 'scholarship-category',
                        content: scholarship.category
                    },
                    {
                        name: 'qualification-required',
                        content: scholarship.qualification
                    },
                    {
                        name: 'organization',
                        content: scholarship.organization
                    },
                    {
                        name: 'scholarship-amount',
                        content: scholarship.amount
                    }
                ]}
            />

            <div className="relative max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
                <div className="flex justify-between items-start mb-6">
                    <button 
                        onClick={() => window.history.back()} 
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <FaArrowLeft /> Back to Scholarships
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
                <section className="border-b border-gray-200 pb-3">
                    <h1 className="text-xl font-bold text-white text-center">
                        {scholarship.title || "Scholarship Details"}
                    </h1>
                </section>
                    
                    <p className="mt-2 text-15px text-[#ececec] text-center">
                        {scholarship.organization || "Not specified"}
                    </p>
                </div>

                <ShareModal
                    open={showShare}
                    onClose={() => setShowShare(false)}
                    url={`https://www.exameets.in${router.asPath}`}
                    title={scholarship.title || "Scholarship Details"}
                    details={shareDetails}
                />

                {/* Scholarship Details */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">Scholarship Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Qualification</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.qualification || 'Not specified'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Category</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.category || 'Not specified'}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Amount</h3>
                            <p className="text-gray-700 dark:text-gray-300">{scholarship.amount || 'Not specified'}</p>
                        </div>
                        {scholarship.is_featured && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Featured</h3>
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
                                <p className="font-bold text-gray-800 dark:text-gray-200">Start Date</p>
                                <p className="text-gray-700 dark:text-gray-300">{(scholarship.start_date)}</p>
                            </div>
                        )}
                        {/* <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-bold text-gray-800 dark:text-gray-200">Posted Date</p>
                            <p className="text-gray-700 dark:text-gray-300">{(scholarship.post_date)}</p>
                        </div> */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="font-bold text-gray-800 dark:text-gray-200">Last Date to Apply</p>
                            <p className="text-gray-700 dark:text-gray-300">{(scholarship.last_date)}</p>
                        </div>
                    </div>
                </section>

                {/* How to Apply */}
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                    <div className="rounded-lg text-center">
                        <a
                            href={scholarship.application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                        >
                            Apply Now
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
};

// Replace the entire getServerSideProps function
export const getServerSideProps = async (context) => {
    await dbConnect();
    const { slug } = context.params;
    const { req } = context;

    try {
        const scholarshipDoc = await Scholarship.findOne({ slug }).lean();

        if (!scholarshipDoc) {
            return { notFound: true };
        }

        // Serialize data similar to other pages
        const serializedScholarship = JSON.parse(JSON.stringify(scholarshipDoc, (key, value) => {
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
                scholarship: serializedScholarship,
                baseUrl: baseUrl || 'http://localhost:3000'
            }
        };
    } catch (error) {
        return { 
            props: { 
                error: error.message || "Error fetching scholarship details",
                baseUrl: 'http://localhost:3000'
            } 
        };
    }
};

export default ScholarshipDetails;