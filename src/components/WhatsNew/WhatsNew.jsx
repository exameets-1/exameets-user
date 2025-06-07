'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestJobs } from '@/store/slices/jobSlice';
import { fetchLatestGovtJobs } from '@/store/slices/govtJobSlice';
import { fetchLatestInternships } from '@/store/slices/internshipSlice';
import { fetchLatestScholarships } from '@/store/slices/scholarshipSlice';
import { fetchLatestResults } from '@/store/slices/resultSlice';
import { fetchLatestAdmitCards } from '@/store/slices/admitCardSlice';
import { fetchLatestAdmissions } from '@/store/slices/admissionSlice';
import { fetchLatestYears } from '@/store/slices/previousSlice';
import { performGlobalSearch, clearSearchResults } from '@/store/slices/globalSearchSlice';
import Link from 'next/link';
import { Search } from 'lucide-react';

//Fix-me : API CALLS

const WhatsNew = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    
    const { latestJobs = [], loading: jobsLoading } = useSelector((state) => state.jobs);
    const { latestGovtJobs = [], loading: govtJobsLoading } = useSelector((state) => state.govtJobs);
    const { latestInternships = [], loading: internshipsLoading } = useSelector((state) => state.internships);
    const { latestScholarships = [], loading: scholarshipsLoading } = useSelector((state) => state.scholarships);
    const { latestResults = [], loading: resultsLoading } = useSelector((state) => state.results);
    const { latestAdmitCards = [], loading: admitCardsLoading } = useSelector((state) => state.admitcards);
    const { latestAdmissions = [], loading: admissionsLoading } = useSelector((state) => state.admissions);
    const { latestYears = [], loading: yearsLoading } = useSelector((state) => state.previousYears);
    const { searchResults = [], loading: searchLoading, error: searchError } = useSelector((state) => state.globalSearch);

    // Fetch data only once when component mounts
    useEffect(() => {
        const fetchData = async () => {
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
        };
        fetchData();
    }, [dispatch]);

    const getTimestampFromObjectId = (objectId) => {
        if (!objectId || typeof objectId !== 'string' || objectId.length !== 24) {
            return 0;
        }
        return parseInt(objectId.substring(0, 8), 16) * 1000;
    };

    // Memoize entries array and sorting
    const sortedEntries = useMemo(() => {
        const entries = [
            ...(latestJobs?.map(item => ({ ...item, type: 'job' })) || []),
            ...(latestGovtJobs?.map(item => ({ ...item, type: 'govtjob' })) || []),
            ...(latestInternships?.map(item => ({ ...item, type: 'internship' })) || []),
            ...(latestScholarships?.map(item => ({ ...item, type: 'scholarship' })) || []),
            ...(latestResults?.map(item => ({ ...item, type: 'result' })) || []),
            ...(latestAdmitCards?.map(item => ({ ...item, type: 'admitcard' })) || []),
            ...(latestAdmissions?.map(item => ({ ...item, type: 'admission' })) || []),
            ...(latestYears?.map(item => ({ ...item, type: 'previousyear' })) || [])
        ];

        return entries
            .filter(entry => entry && entry._id)
            .sort((a, b) => {
                const timestampA = getTimestampFromObjectId(a._id);
                const timestampB = getTimestampFromObjectId(b._id);
                return timestampB - timestampA;
            });
    }, [latestJobs, latestGovtJobs, latestInternships, latestScholarships, 
        latestResults, latestAdmitCards, latestAdmissions, latestYears]);

    // Handle search debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Handle search execution
    useEffect(() => {
        if (debouncedSearchTerm.trim() === '') {
            dispatch(clearSearchResults());
            return;
        }

        dispatch(performGlobalSearch(debouncedSearchTerm));
    }, [debouncedSearchTerm, dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getEntryLink = (entry) => {
        if (!entry || !entry.type || !entry._id) return '#';
        
        switch(entry.type) {
            case 'job': return `/jobs/${entry.slug}`;
            case 'govtjob': return `/govtjobs/${entry.slug}`;
            case 'internship': return `/internships/${entry.slug}`;
            case 'scholarship': return `/scholarships/${entry.slug}`;
            case 'result': return `/results/${entry.slug}`;
            case 'admitcard': return `/admitcards/${entry.slug}`;
            case 'admission': return `/admissions/${entry.slug}`;
            case 'previousyear': return `/papers/${entry.subject}`;
            default: return '#';
        }
    };

    const getEntryTitle = (entry) => {
        if (!entry) return '';
        
        switch(entry.type) {
            case 'job':
                return `${entry.jobTitle || ''} at ${entry.companyName || ''}`;
            case 'govtjob':
                return `${entry.jobTitle || ''} at ${entry.organization || ''}`;
            case 'internship':
                return `${entry.title || ''} at ${entry.organization || ''}`;
            case 'previousyear':
                return `PYQ for ${entry.subject || ''} - ${entry.year || ''}`;
            case 'scholarship':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            case 'admission':
                return `${entry.title || ''} - ${entry.institute || ''}`;
            case 'result':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            case 'admitcard':
                return `${entry.title || ''} - ${entry.organization || ''}`;
            default:
                return entry.title || '';
        }
    };

    const isLoading = jobsLoading || govtJobsLoading || internshipsLoading || 
                      scholarshipsLoading || resultsLoading || admitCardsLoading || 
                      admissionsLoading || yearsLoading || searchLoading;

    const displayEntries = searchTerm.trim() !== '' ? 
        [...(searchResults || [])].sort((a, b) => {
            const timestampA = getTimestampFromObjectId(a._id);
            const timestampB = getTimestampFromObjectId(b._id);
            return timestampB - timestampA;
        }) : 
        sortedEntries;

    return (
        <div className="h-full bg-gray-100 dark:bg-gray-800 p-5">
            <div className="h-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                        What&apos;s New
                    </h2>
                </div>
                
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="         Search across all sections..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 focus:outline-none focus:border-[#015990] focus:ring-1 focus:ring-[#015990]"
                    />
                </div>
                
                <div className="flex-1">
                    <div className="h-96 overflow-y-auto rounded-lg">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="w-10 h-10 border-4 border-[#015990] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : searchError ? (
                            <div className="text-center py-6 text-red-500 dark:text-red-400">
                                {searchError}
                            </div>
                        ) : displayEntries.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                {searchTerm.trim() !== '' ? 'No results found' : 'No entries available'}
                            </div>
                        ) : (
                            <table className="w-full">
                                <tbody>
                                    {displayEntries.map((entry, index) => (
                                        <tr 
                                            key={entry._id || index}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-600 even:bg-gray-50 dark:even:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
                                        >
                                            <td className="p-3 text-gray-700 dark:text-gray-100">
                                                {getEntryTitle(entry)}
                                            </td>
                                            <td className="p-3">
                                                <Link 
                                                    href={getEntryLink(entry)}
                                                    className="inline-block px-4 py-2 bg-[#015990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors text-sm"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                
                <div className="mt-6 text-center">
                    <Link href="/whatsnew">
                        <button 
                            className="px-6 py-2 bg-[#015990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors"
                        >
                            View All
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WhatsNew;