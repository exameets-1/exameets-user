// 'use client'
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllITJobs, fetchAllNonITJobs } from "@/store/slices/jobSlice";
// import Link from "next/link";


// //Fix-me API calls


// const SelectedJobs = () => {
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.user);
//     const { jobs, loading } = useSelector((state) => state.jobs);
//     const [jobType, setJobType] = useState("");

//     useEffect(() => {
//         if (user?.preferences?.notifications_about) {
//             const type = user.preferences.notifications_about;
//             setJobType(type);
//             if (type === 'IT') {
//                 dispatch(fetchAllITJobs());
//             } else if (type === 'NON-IT') {
//                 dispatch(fetchAllNonITJobs());
//             }
//         }
//     }, [user, dispatch]);

//     const renderContent = () => {
//         if (!jobs || jobs.length === 0) {
//             return (
//                 <div className="text-center py-6 text-gray-500 dark:text-gray-400">
//                     <p className="text-lg mb-2">No Jobs Found</p>
//                     <p className="text-sm">Please check back later for new job postings.</p>
//                 </div>
//             );
//         }

//         return (
//             <div className="h-96 overflow-y-auto rounded-lg">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
//                             <th className="p-3 text-left">Sl.No</th>
//                             <th className="p-3 text-left">Title</th>
//                             <th className="p-3 text-left">Organization</th>
//                             <th className="p-3 text-left">Location</th>
//                             <th className="p-3 text-left">View</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {jobs.map((job, index) => (
//                             <tr
//                                 key={job._id}
//                                 className="hover:bg-blue-50 dark:hover:bg-gray-600 even:bg-gray-50 dark:even:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
//                             >
//                                 <td className="p-3 text-gray-700 dark:text-gray-100">{index + 1}</td>
//                                 <td className="p-3 text-gray-700 dark:text-gray-100">{job.jobTitle}</td>
//                                 <td className="p-3 text-gray-700 dark:text-gray-100">{job.companyName}</td>
//                                 <td className="p-3 text-gray-700 dark:text-gray-100">{job.city}</td>
//                                 <td className="p-3">
//                                     <Link
//                                         href={`/jobs/${job.slug}`}
//                                         className="inline-block px-4 py-2 bg-[#015990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors text-sm"
//                                     >
//                                         View
//                                     </Link>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     };

//     return (
//         <div className="h-full bg-gray-100 dark:bg-gray-800 p-5">
//             <div className="h-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
//                 <div className="mb-6">
//                     <h2 className="text-3xl text-[#155990] dark:text-gray-300 text-center mb-6">
//                         Preference Selected: {jobType}
//                     </h2>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center h-40">
//                         <div className="w-10 h-10 border-4 border-[#015990] border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                 ) : (
//                     <div className="flex-1">
//                         {renderContent()}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SelectedJobs;

'use client'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllITJobs, fetchAllNonITJobs } from "@/store/slices/jobSlice";
import Link from "next/link";

const SelectedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { itJobs, nonItJobs, loading } = useSelector((state) => state.jobs);
    const [jobType, setJobType] = useState("");

    useEffect(() => {
        if (user?.preferences?.notifications_about) {
            const type = user.preferences.notifications_about;
            setJobType(type);
            if (type === 'IT') {
                dispatch(fetchAllITJobs());
            } else if (type === 'NON-IT') {
                dispatch(fetchAllNonITJobs());
            }
        }
    }, [user, dispatch]);

    const selectedJobs = jobType === 'IT' ? itJobs : jobType === 'NON-IT' ? nonItJobs : [];

    const renderContent = () => {
        if (!selectedJobs || selectedJobs.length === 0) {
            return (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <p className="text-lg mb-2">No Jobs Found</p>
                    <p className="text-sm">Please check back later for new job postings.</p>
                </div>
            );
        }

        return (
            <div className="h-96 overflow-y-auto rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                            <th className="p-3 text-left">Sl.No</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Organization</th>
                            <th className="p-3 text-left">Location</th>
                            <th className="p-3 text-left">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedJobs.map((job, index) => (
                            <tr
                                key={job._id}
                                className="hover:bg-blue-50 dark:hover:bg-gray-600 even:bg-gray-50 dark:even:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
                            >
                                <td className="p-3 text-gray-700 dark:text-gray-100">{index + 1}</td>
                                <td className="p-3 text-gray-700 dark:text-gray-100">{job.jobTitle}</td>
                                <td className="p-3 text-gray-700 dark:text-gray-100">{job.companyName}</td>
                                <td className="p-3 text-gray-700 dark:text-gray-100">{job.city}</td>
                                <td className="p-3">
                                    <Link
                                        href={`/jobs/${job.slug}`}
                                        className="inline-block px-4 py-2 bg-[#015990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors text-sm"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="h-full bg-gray-100 dark:bg-gray-800 p-5">
            <div className="h-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
                <div className="mb-6">
                    <h2 className="text-3xl text-[#155990] dark:text-gray-300 text-center mb-6">
                        Preference Selected: {jobType}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="w-10 h-10 border-4 border-[#015990] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectedJobs;
