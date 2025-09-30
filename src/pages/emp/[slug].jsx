import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { FaIdBadge, FaBuilding, FaCalendarAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function EmployeeIDCard() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate employee ID format (4 alphanumeric characters)
  const isValidEmployeeId = (id) => {
    if (!id || typeof id !== 'string') return false;
    // Exactly 4 alphanumeric characters, no special chars or path traversal
    return /^[A-Za-z0-9]{4}$/.test(id);
  };

  useEffect(() => {
    if (!slug) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate slug format before making request
        if (!isValidEmployeeId(slug)) {
          throw new Error('Invalid employee ID format');
        }

        // Sanitize: convert to uppercase to match server expectation
        const sanitizedSlug = slug.toUpperCase();
        
        const response = await fetch(`/api/emp/${sanitizedSlug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Employee not found');
        }

        setEmployee(data.employee);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Employee Not Found</title>
          <meta name="description" content="Employee information not found" />
        </Head>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="text-red-500 text-4xl mb-3">!</div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Not Found
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {error}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{employee.name} - Employee ID</title>
        <meta name="description" content={`Employee ID for ${employee.name}`} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 px-4">
        <div className="w-full max-w-sm mx-auto">
          {/* ID Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-4 py-3 text-center">
              <h2 className="text-white text-sm font-medium tracking-wide">
                EMPLOYEE ID
              </h2>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Photo and Name */}
              <div className="text-center mb-4">
                <div className="relative inline-block mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 mx-auto">
                    <Image
                      src={employee.photoUrl}
                      alt={employee.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {employee.name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {employee.role}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaIdBadge className="text-sm mr-2" />
                    <span className="text-xs font-medium">ID</span>
                  </div>
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {employee.empId}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaBuilding className="text-sm mr-2" />
                    <span className="text-xs font-medium">Department</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.department}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt className="text-sm mr-2" />
                    <span className="text-xs font-medium">Since</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(employee.joinDate)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                  <FaCheckCircle className="mr-1 text-xs" />
                  Active
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official Employee Identification
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Report misuse to security
            </p>
          </div>
        </div>
      </div>
    </>
  );
}