'use client'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetUpdate } from "@/store/slices/updateProfileSlice";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false,
    isDifferent: false
  });

  const dispatch = useDispatch();
  const { loading, error, isPasswordUpdated } = useSelector((state) => state.updateProfile);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (isPasswordUpdated) {
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(resetUpdate());
    }
  }, [error, isPasswordUpdated, dispatch]);

  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword && newPassword !== "",
      isDifferent: newPassword !== oldPassword && newPassword !== ""
    });
  }, [newPassword, confirmPassword, oldPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(validations).every(Boolean)) {
      toast.error("Please meet all password requirements");
      return;
    }

    try {
      await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
    } catch (err) {
      // Error is handled in useEffect
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex justify-center items-start">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 w-full max-w-[500px] mt-4 sm:mt-8">
        <h2 className="text-[#1a365d] dark:text-white text-2xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">
          Update Password
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold">Current Password</label>
            <div className="relative flex items-center">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute right-3 bg-transparent border-none text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold">New Password</label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute right-3 bg-transparent border-none text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 dark:text-gray-300 text-sm font-bold">Confirm New Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-3 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="absolute right-3 bg-transparent border-none text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg my-4">
            <h3 className="text-gray-800 dark:text-gray-200 text-base mb-4">Password Requirements:</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li className={`flex items-center gap-2 text-sm ${validations.minLength ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.minLength ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                At least 8 characters
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.hasUpper ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.hasUpper ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                At least one uppercase letter
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.hasLower ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.hasLower ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                At least one lowercase letter
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.hasNumber ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.hasNumber ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                At least one number
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.hasSpecial ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.hasSpecial ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                At least one special character
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.passwordsMatch ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.passwordsMatch ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                Passwords match
              </li>
              <li className={`flex items-center gap-2 text-sm ${validations.isDifferent ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'}`}>
                {validations.isDifferent ? <FaCheck className="text-green-500 dark:text-green-400" /> : <FaTimes className="text-red-500 dark:text-red-400" />}
                Different from current password
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:-translate-y-px"
            disabled={loading || !Object.values(validations).every(Boolean)}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;