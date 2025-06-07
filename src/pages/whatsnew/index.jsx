'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestJobs } from '@/store/slices/jobSlice';
import { fetchLatestGovtJobs } from '@/store/slices/govtJobSlice';
import { fetchLatestInternships } from '@/store/slices/internshipSlice';
import { fetchLatestScholarships } from '@/store/slices/scholarshipSlice';
import { fetchLatestResults } from '@/store/slices/resultSlice';
import { fetchLatestAdmitCards } from '@/store/slices/admitCardSlice';
import { fetchLatestAdmissions } from '@/store/slices/admissionSlice';
import { fetchLatestYears } from '@/store/slices/previousSlice';
import Link from 'next/link';
import Spinner from '@/components/Spinner';
import useScrollToTop from '@/hooks/useScrollToTop';

const WhatsNew = () => {
    useScrollToTop();
    const dispatch = useDispatch();
    
    // Redux state selectors
    const { 
        latestJobs = [],
        loading: jobsLoading,
        error: jobsError 
    } = useSelector((state) => state.jobs);

    const {
        latestGovtJobs = [],
        loading: govtJobsLoading,
        error: govtJobsError
    } = useSelector((state) => state.govtJobs);

    const {
        latestInternships = [],
        loading: internshipsLoading,
        error: internshipsError
    } = useSelector((state) => state.internships);

    const {
        latestScholarships = [],
        loading: scholarshipsLoading,
        error: scholarshipsError
    } = useSelector((state) => state.scholarships);

    const {
        latestResults = [],
        loading: resultsLoading,
        error: resultsError
    } = useSelector((state) => state.results);

    const {
        latestAdmitCards = [],
        loading: admitCardsLoading,
        error: admitCardsError
    } = useSelector((state) => state.admitcards);

    const {
        latestAdmissions = [],
        loading: admissionsLoading,
        error: admissionsError
    } = useSelector((state) => state.admissions);

    const {
        latestYears = [],
        loading: yearsLoading,
        error: yearsError
    } = useSelector((state) => state.previousYears);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchLatestJobs()),
                    dispatch(fetchLatestGovtJobs()),
                    dispatch(fetchLatestInternships()),
                    dispatch(fetchLatestScholarships()),
                    dispatch(fetchLatestResults()),
                    dispatch(fetchLatestAdmitCards()),
                    dispatch(fetchLatestAdmissions()),
                    dispatch(fetchLatestYears())
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [dispatch]);

    // Loading and error states
    const isLoading = jobsLoading || govtJobsLoading || internshipsLoading || 
                    scholarshipsLoading || resultsLoading || admitCardsLoading || 
                    admissionsLoading || yearsLoading;

    const error = jobsError || govtJobsError || internshipsError || 
                scholarshipsError || resultsError || admitCardsError || 
                admissionsError || yearsError;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Sections configuration
    const sections = [
        {
            title: "Latest Jobs",
            data: latestJobs,
            path: "/jobs/",
            viewAll: "/jobs",
            getContent: (item) => `${item.jobTitle} - ${item.companyName}`
        },
        {
            title: "Latest Government Jobs",
            data: latestGovtJobs,
            path: "/govtjobs/",
            viewAll: "/govtjobs",
            getContent: (item) => `${item.jobTitle} - ${item.organization}`
        },
        {
            title: "Latest Internships",
            data: latestInternships,
            path: "/internships/",
            viewAll: "/internships",
            getContent: (item) => `${item.title} - ${item.organization}`
        },
        {
            title: "Latest Scholarships",
            data: latestScholarships,
            path: "/scholarships/",
            viewAll: "/scholarships",
            getContent: (item) => `${item.title} - ${item.organization}`
        },
        {
            title: "Latest Results",
            data: latestResults,
            path: "/results/",
            viewAll: "/results",
            getContent: (item) => `${item.title} - ${item.organization}`
        },
        {
            title: "Latest Admit Cards",
            data: latestAdmitCards,
            path: "/admitcards/",
            viewAll: "/admitcards",
            getContent: (item) => `${item.title} - ${item.organization}`
        },
        {
            title: "Latest Admissions",
            data: latestAdmissions,
            path: "/admissions/",
            viewAll: "/admissions",
            getContent: (item) => `${item.title} - ${item.institute}`
        },
        {
            title: "Latest PYQ's",
            data: latestYears,
            viewAll: "/papers",
            getContent: (item) => `${item.year} - ${item.subject}`,
            path: "/papers/"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-[#015990] dark:bg-gray-950 p-6 rounded-lg mb-8">
                <h1 className="text-3xl font-bold text-white text-center">What&apos;s New</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-[#015990] dark:border-gray-700 rounded-lg p-4 shadow-md flex flex-col">
                        <h2 className="text-xl font-semibold text-[#015990] dark:text-white border-b-2 border-[#015990] dark:border-gray-700 pb-2 mb-4">
                            {section.title}
                        </h2>
                        
                        {section.data.length > 0 ? (
                            section.data.map((item) => (
                                <div key={item._id} className="py-2 border-b last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                    <Link 
                                        href={`${section.path}${section.title === 'Latest PYQ\'s' ? item.subject : item.slug}`} 
                                        className="text-gray-800 dark:text-gray-200 hover:text-[#015990] dark:hover:text-[#6BB6E8]"
                                    >
                                        {section.getContent(item)}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">
                                No recent {section.title.toLowerCase()}
                            </p>
                        )}

                        <Link href={section.viewAll} className="mt-auto">
                            <button className="mt-4 bg-[#015990] dark:bg-gray-950 text-white px-4 py-2 rounded hover:bg-[#014d7a] dark:hover:bg-[#013A5C] transition">
                                View All
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhatsNew;