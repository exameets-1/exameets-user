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

  useEffect(() => {
    if (!slug) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/emp/${slug}`);
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading employee information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Employee Not Found - Digital ID Card</title>
          <meta name="description" content="Employee information not found" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Employee Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please check the employee ID and try again.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{employee.name} - Employee ID Card</title>
        <meta name="description" content={`Digital ID card for ${employee.name}, ${employee.role} at our company`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Company Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg shadow-md px-6 py-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Company Digital ID
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Official Employee Identification
              </p>
            </div>
          </div>

          {/* ID Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Card Header with Company Branding */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">EMPLOYEE ID CARD</h2>
                    <p className="text-blue-100 text-sm">Digital Identification</p>
                  </div>
                  <div className="text-right">
                    <FaCheckCircle className="text-2xl text-green-300 mb-1" />
                    <p className="text-xs text-blue-100">VERIFIED</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Information */}
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Employee Photo */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-600 shadow-lg">
                      <Image
                        src={employee.photoUrl}
                        alt={employee.name}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/160/160';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-md">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {employee.name}
                  </h1>
                  <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                    {employee.role}
                  </h2>

                  {/* Employee Information Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                        <FaIdBadge className="mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Employee ID</span>
                      </div>
                      <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                        {employee.empId}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                        <FaBuilding className="mr-2 text-green-500" />
                        <span className="text-sm font-medium">Department</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {employee.department}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:col-span-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                        <FaCalendarAlt className="mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Member Since</span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(employee.joinDate)}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-6">
                    <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
                      <FaCheckCircle className="mr-2" />
                      <span className="font-medium">Active Employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <p>Official Company Employee Identification</p>
                <p className="mt-2 sm:mt-0">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                🔒 This is an official employee identification. 
                Report any misuse to company security.
              </p>
            </div>
          </div>

          {/* QR Code Placeholder (Optional) */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  QR Code<br />Placeholder
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Scan for verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}