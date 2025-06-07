'use client'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/store/slices/updateProfileSlice";
import { getUser } from "@/store/slices/userSlice";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);
  const { loading: updateLoading } = useSelector((state) => state.updateProfile);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: ""
  });

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = {};
    if (formData.name !== user.name) updatedData.name = formData.name;
    if (formData.dob !== (user.dob ? new Date(user.dob).toISOString().split('T')[0] : "")) updatedData.dob = formData.dob;
    if (formData.gender !== user.gender) updatedData.gender = formData.gender;

    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes to update");
      return;
    }

    try {
      await dispatch(updateProfile(updatedData)).unwrap();
      toast.success("Profile updated successfully!");
      dispatch(getUser());
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100 dark:bg-gray-900 flex justify-center items-start">
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-md p-6 md:p-8 w-full max-w-lg mt-4 md:mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 dark:text-gray-300 font-medium text-sm">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              minLength={3}
              maxLength={30}
              className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 dark:text-gray-300 font-medium text-sm">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 dark:text-gray-300 font-medium text-sm">Gender</label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base appearance-none bg-no-repeat bg-right-4 cursor-pointer bg-gray-50 dark:bg-gray-700 dark:text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234A5568'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: '1rem',
                backgroundPosition: 'right 0.75rem center'
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className={`mt-4 bg-[#015990] dark:bg-gray-950 hover:bg-gray-500 dark:hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 transform hover:-translate-y-px ${
              (loading || updateLoading) ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : ''
            }`}
            disabled={loading || updateLoading}
          >
            {updateLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;