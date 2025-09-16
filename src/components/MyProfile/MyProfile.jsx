'use client'

import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  Calendar,
  Cake,
  User,
} from 'lucide-react';

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  const profileFields = [
    // { label: "Email", value: user?.email, icon: <Mail className="w-5 h-5 text-gray-600" /> },
    { label: "Phone", value: user?.phone, icon: <Phone className="w-5 h-5 text-gray-600" /> },
    {
      label: "Date of Birth",
      value: user?.dob
        ? new Date(user.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null,
      icon: <Cake className="w-5 h-5 text-gray-600" />
    },
    { label: "Gender", value: user?.gender === "male" ? "Male" : "Female", icon: <User className="w-5 h-5 text-gray-600" /> },
    {
      label: "Joined",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null,
      icon: <Calendar className="w-5 h-5 text-gray-600" />
    }
  ];

  return (
    <div className="p-2 max-w-3xl mx-auto">
      {/* <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h2> */}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#015990] dark:bg-gray-950 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex h-20 w-20 bg-white dark:bg-gray-700 rounded-full items-center justify-center text-3xl text-gray-800 dark:text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user?.name || "User"}</h3>
              <p className="text-blue-100 dark:text-blue-200">{user?.email || "No email provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {profileFields.map((field, index) => (
            <div
              key={index}
              className="flex items-center p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-3 w-2/5">
                <span className="text-xl" aria-hidden="true">{field.icon}</span>
                <span className="font-bold text-gray-700 dark:text-gray-300 hidden md:inline">{field.label}</span>
              </div>
              <div className={`w-3/5 text-right ${!field.value ? "text-gray-400 dark:text-gray-500 italic" : "text-gray-800 dark:text-gray-200"}`}>
                {field.value || "Not provided"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Need to update your profile information? Visit your account settings.
      </div>
    </div>
  );
};

export default MyProfile;