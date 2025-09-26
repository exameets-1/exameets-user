'use client';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function NotFound() {
  const { darkMode } = useTheme();

  useEffect(() => {
    document.title = '404 - Lost in Exameets?';
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-4 text-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl font-bold mb-6">Oops! This page missed its destination 📝</p>
      <p className="mb-8 text-lg">But don’t worry, you can head back and find the right place!</p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Go to Home
        </Link>
        <Link href="/jobs" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Tech Jobs
        </Link>
        <Link href="/internships" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Internships
        </Link>
        {/* <Link href="/govtjobs" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Govt Jobs
        </Link>
        <Link href="/scholarships" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Scholarships
        </Link>
        <Link href="/results" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Results
        </Link>
        <Link href="/papers" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Previous Year Papers
        </Link>
        <Link href="/admissions" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Admissions
        </Link>
        <Link href="/admitcards" className="px-5 py-2 rounded-md font-semibold bg-[#015990] text-white hover:bg-[#01456d] transition">
          Admit Cards
        </Link> */}


      </div>
    </div>
  );
}
