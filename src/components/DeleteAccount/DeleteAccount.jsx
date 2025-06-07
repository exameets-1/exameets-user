'use client'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { deleteAccount } from '@/store/slices/userSlice';

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmDelete) {
      toast.error('Please confirm account deletion by checking the checkbox');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    try {
      await dispatch(deleteAccount(password)).unwrap();
      toast.success('Your account has been deleted successfully');
      // Add a small delay before navigation to show the success message
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      toast.error(error || 'Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900 border border-red-500 text-red-600 dark:text-red-300 p-6 rounded-lg mb-8">
        <h3 className="font-bold text-lg mb-3">Warning: This action cannot be undone</h3>
        <p className="text-sm leading-relaxed">
          Deleting your account will permanently remove all your data, including your profile information,
          exam records, and any other associated data. You won't be able to register again with the same mobile number you used. This action is irreversible.
        </p>
      </div>
  
      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Enter Your Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password to confirm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-700 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
  
        <div className="flex items-start gap-3 mb-8">
          <input
            type="checkbox"
            id="confirm-delete"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
            className="mt-1 w-5 h-5 text-red-600 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 dark:focus:ring-red-700"
          />
          <label htmlFor="confirm-delete" className="text-sm text-gray-600 dark:text-gray-300">
            I understand that this action cannot be undone and I want to permanently delete my account
          </label>
        </div>
  
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors dark:bg-red-700 dark:hover:bg-red-800 disabled:bg-red-200 disabled:cursor-not-allowed"
            disabled={loading || !confirmDelete || !password}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full md:w-auto px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccount;