'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchAllITJobs, fetchAllNonITJobs } from '@/store/slices/jobSlice'; // import these
import { fetchMatchedJobs } from '@/store/slices/userSlice';
import { fetchLatestAdmissions } from '@/store/slices/admissionSlice';
import { fetchLatestInternships } from '@/store/slices/internshipSlice';
import { fetchLatestScholarships } from '@/store/slices/scholarshipSlice';
import { fetchLatestResults } from '@/store/slices/resultSlice'; 

export default function SelectedJobs() {
  const { matchedJobs, loading, error, user } = useSelector((state) => state.user);
  const { latestAdmissions, loading: admissionsLoading } = useSelector((state) => state.admissions);
  const { latestInternships, loading: internshipsLoading } = useSelector((state) => state.internships);
  const { latestScholarships, loading: scholarshipsLoading } = useSelector((state) => state.scholarships);
  const { latestResults, loading: resultsLoading } = useSelector((state) => state.results);
  const { itJobs, nonItJobs, loading: jobsLoading } = useSelector((state) => state.jobs);

  
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
  const { notifications_about } = user?.preferences || {};
  const preference = notifications_about?.toLowerCase() || '';

  switch (preference) {
    case 'admissions':
      dispatch(fetchLatestAdmissions());
      break;
    case 'internships':
      dispatch(fetchLatestInternships());
      break;
    case 'scholarships':
      dispatch(fetchLatestScholarships());
      break;
    case 'results':
      dispatch(fetchLatestResults());
      break;
    case 'it':
      dispatch(fetchAllITJobs());
      break;
    case 'non-it':
      dispatch(fetchAllNonITJobs());
      break;
    default:
      dispatch(fetchMatchedJobs());
  }
}, [dispatch, user?.preferences]);

  const isLoading = loading || admissionsLoading || internshipsLoading || scholarshipsLoading || resultsLoading;

  const handleItemClick = (itemId) => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about || '';
    
    if(preference === 'admissions'){
      router.push(`/admissions/${itemId}`);
    } else if(preference === 'internships'){
      router.push(`/internships/${itemId}`);
    } else if(preference === 'scholarships'){
      router.push(`/scholarships/${itemId}`);
    } else if(preference === 'results'){
      router.push(`/results/${itemId}`);
    } else if (preference === 'IT' || preference === 'NON-IT') {
      router.push(`/jobs/${itemId}`);
    } else {
      router.push(`/govtjobs/${itemId}`);
    }
  };

  const handleViewAll = () => {
    const { notifications_about } = user?.preferences || {}; 
    const preference = notifications_about?.toLowerCase() || '';
    
    if(preference === 'admissions'){
      router.push(`/admissions`);
    } else if(preference === 'internships'){
      router.push(`/internships`);
    } else if(preference === 'scholarships'){
      router.push(`/scholarships`);
    } else if(preference === 'results'){
      router.push(`/results`);
    } else if (preference === 'it' || preference === 'non-it') {
      router.push(`/selected-jobs`);
    } else {
      router.push(`/govtjobs`);
    }
  }

  const getEntryTitle = (item, type) => {
    if (!item) return '';
    
    switch(type) {
      case 'job':
        return `${item.jobTitle || ''} at ${item.organization || item.companyName || ''}`;
      case 'internship':
        return `${item.title || ''} at ${item.organization || item.company || ''}`;
      case 'scholarship':
        return `${item.title || ''} - ${item.organization || item.company || ''}`;
      case 'admission':
        return `${item.title || ''} - ${item.institute || ''}`;
      case 'result':
        return `${item.title || ''} - ${item.organization || item.company || ''}`;
      default:
        return item.title || '';
    }
  };

  const renderContent = () => {
    const { notifications_about } = user?.preferences || {};
    const preference = notifications_about?.toLowerCase() || '';
    
    let data = [];
    let type = '';

    switch (preference) {
      case 'admissions':
        data = latestAdmissions || [];
        type = 'admission';
        break;
      case 'internships':
        data = latestInternships || [];
        type = 'internship';
        break;
      case 'scholarships':
        data = latestScholarships || [];
        type = 'scholarship';
        break;
      case 'results':
        data = latestResults || [];
        type = 'result';
        break;
      case 'it':
        data = itJobs || [];
        type = 'job';
        break;
      case 'non-it':
        data = nonItJobs || [];
        type = 'job';
        break;
      default:
        data = matchedJobs || [];
        type = 'job';
        break;
    }

    if (!data.length) {
      return (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No Matched Content Found</p>
          <p className="text-sm">Update your preferences to see content that matches your interests.</p>
        </div>
      );
    }

    return (
      <div className="h-96 overflow-y-auto rounded-lg">
        <table className="w-full">
          <tbody>
            {data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-blue-50 dark:hover:bg-gray-600 even:bg-gray-50 dark:even:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600"
                onClick={() => handleItemClick(item.slug)}
              >
                <td className="p-3 text-gray-700 dark:text-gray-100">
                  {getEntryTitle(item, type)}
                </td>
                <td className="p-3">
                  <button 
                    className="inline-block px-4 py-2 bg-[#015990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    View
                  </button>
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
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
            For You
          </h2>
          <h2 className="text-xl text-gray-600 dark:text-gray-300 text-center mb-6">
            Preference Selected: {user?.preferences?.notifications_about}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-[#015990] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex-1">  
              {renderContent()}
            </div>
            <div className="mt-6 text-center">
              <button 
                onClick={handleViewAll}
                className="px-6 py-2 bg-[#155990] dark:bg-gray-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors"
              >
                View All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}