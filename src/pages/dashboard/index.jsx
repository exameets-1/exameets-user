"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors, getUser } from "@/store/slices/userSlice";
import { Settings } from 'lucide-react';
import { FaUser, FaEdit, FaKey, FaSignOutAlt, FaTrash } from "react-icons/fa";
import MyProfile from "@/components/MyProfile/MyProfile";
import UpdateProfile from "@/components/UpdateProfile/UpdateProfile";
import UpdatePassword from "@/components/UpdatePassword/UpdatePassword";
import DeleteAccount from "@/components/DeleteAccount/DeleteAccount";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("My Profile");

  const { loading, isAuthenticated, error, user } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeComponent]);

  useEffect(() => {
    if (isAuthenticated && !user?.name) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    if (error && error !== "Failed to fetch matched jobs") {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [dispatch, error, loading, isAuthenticated, router]);

  const menuItems = [
    { name: "My Profile", icon: <FaUser />, component: "My Profile" },
    { name: "Update Profile", icon: <FaEdit />, component: "Update Profile" },
    { name: "Update Password", icon: <FaKey />, component: "Update Password" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#005587] dark:text-gray-400 mr-4">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome, <span className="text-[#005587] dark:text-gray-400 font-medium">{user && user.name}</span> !
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Header & Toggle */}
          <div className="md:hidden flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            <h1 className="text-xl font-semibold text-[#005587] dark:text-gray-400">Dashboard</h1>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#005587] dark:text-blue-400 text-2xl p-2"
            >
              <Settings className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mobile Menu Backdrop */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Sidebar/Navigation */}
          <div className={`fixed md:static inset-y-0 left-0 w-72 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full md:h-fit
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <h4 className="text-lg font-semibold text-[#005587] dark:text-gray-400 mb-6 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
              Manage Account
            </h4>
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveComponent(item.component);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    activeComponent === item.component 
                      ? 'bg-[#005587] dark:bg-gray-950 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-[#005587] dark:hover:text-gray-400'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt />
                <span className="ml-3">Logout</span>
              </button>
              <button
                onClick={() => {
                  setActiveComponent("Delete Account");
                  setIsMenuOpen(false);
                }}
                className="flex items-center p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTrash />
                <span className="ml-3">Delete Account</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 md:p-8">
            <div className="mb-8 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-[#005587] dark:text-gray-400">{activeComponent}</h2>
            </div>
            {(() => {
              switch (activeComponent) {
                case "My Profile":
                  return <MyProfile />;
                case "Update Profile":
                  return <UpdateProfile />;
                case "Update Password":
                  return <UpdatePassword />;
                case "Delete Account":
                  return <DeleteAccount />;
                default:
                  return <MyProfile />;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;