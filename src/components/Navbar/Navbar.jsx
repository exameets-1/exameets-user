'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCog, X, Menu, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { darkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);

  // Function to check if a path is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Mobile nav item style function
  const getNavItemStyle = (path) => {
    return `${
      isActive(path) 
        ? 'text-[#015990] font-bold border-l-4 border-l-[#015990] pl-2 dark:text-[#DFF1FF]' 
        : ''
    }`;
  };

  return (
    <header className="w-full dark:bg-gray-800">
      {/* Top Line */}
      <div className="bg-[#015990] dark:bg-gray-950 text-white dark:text-gray-100 text-center py-2 flex items-center justify-center px-4">
        <p className="text-base md:text-xl">
          ...Exameets is a one-step platform for students, where all the needs are met...
        </p>
      </div>

      {/* Logo and Menu */}
      <div className="flex items-center justify-between px-5 py-4 relative dark:bg-gray-800">
        {/* Logo */}
        <Link href="/" className="max-w-[320px] mx-auto">
          <Image
            src={darkMode ? "/images/logo-final-dark.webp" : "/images/logo-final.webp"}
            alt="Exameets Logo"
            width={320}
            height={114}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 80vw, 320px"
            className="w-auto h-auto max-h-[114px]"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button 
          className="p-2 rounded-md md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Menu size={28} color={darkMode ? 'white' : 'black'} />
        </button>

        {/* Sliding Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden overflow-y-auto`}>
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold dark:text-white">Menu</h2>
            <button onClick={closeMobileMenu} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <X size={24} color={darkMode ? 'white' : 'black'} />
            </button>
          </div>
          
          <div className="flex flex-col p-4 space-y-4">
            <Link href="/" onClick={closeMobileMenu} className={getNavItemStyle('/')}>Home</Link>
            <Link href="/govtjobs" onClick={closeMobileMenu} className={getNavItemStyle('/govtjobs')}>Govt Jobs</Link>
            <Link href="/admitcards" onClick={closeMobileMenu} className={getNavItemStyle('/admitcards')}>Admit Cards</Link>
            <Link href="/results" onClick={closeMobileMenu} className={getNavItemStyle('/results')}>Results</Link>
            <Link href="/jobs" onClick={closeMobileMenu} className={getNavItemStyle('/jobs')}>Tech Jobs</Link>
            <Link href="/internships" onClick={closeMobileMenu} className={getNavItemStyle('/internships')}>Internships</Link>
            <Link href="/admissions" onClick={closeMobileMenu} className={getNavItemStyle('/admissions')}>Admissions</Link>
            <Link href="/previousyears" onClick={closeMobileMenu} className={getNavItemStyle('/papers')}>PYQs</Link>
            <Link href="/scholarships" onClick={closeMobileMenu} className={getNavItemStyle('/scholarships')}>Scholarships</Link>
          </div>
          
          {/* Footer for mobile menu */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
            <div className="flex justify-center items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md flex items-center gap-2"
              >
                <span>{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex md:flex-wrap md:justify-center md:gap-4 md:items-center">
          <div className="flex flex-col items-center m-4 group">
            <Link href="/" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/Home_Icon.svg" alt="Home" width={36} height={36} />
              </div>
              <span className="text-xl dark:text-gray-100">Home</span>
            </Link>
          </div>

          {/* Updated GovtJobs with hover styling */}
          <div className="relative flex flex-col items-center m-4 group">
            <Link href="/govtjobs" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50] transition-all duration-300 group-hover:bg-[#B3E0FF] group-hover:shadow-md">
                <Image src="/Govt_Icon.svg" alt="Govt Jobs" width={36} height={36} className="w-9 h-auto dark-image transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl dark:text-gray-100">Govt Jobs</span>
                <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
              </div>
            </Link>
            
            <div className="absolute hidden bg-white dark:bg-gray-700 shadow-lg rounded-md top-[100px] left-1/2 transform -translate-x-1/2 min-w-[180px] z-50 group-hover:block transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
              <div className="py-1">
                <Link href="/govtjobs" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors duration-200">All Govt Jobs</Link>
                <Link href="/admitcards" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors duration-200">Admit Cards</Link>
                <Link href="/results" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100 transition-colors duration-200">Results</Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center m-4">
            <Link href="/jobs" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/Tech_Icon.svg" alt="Tech Jobs" width={36} height={36} className="w-9 h-auto dark-image" />
              </div>
              <span className="text-xl dark:text-gray-100">Tech Jobs</span>
            </Link>
          </div>

          <div className="flex flex-col items-center m-4">
            <Link href="/internships" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/Courses_Icon.svg" alt="Courses" width={36} height={36} className="w-9 h-auto dark-image" />
              </div>
              <span className="text-xl dark:text-gray-100">Internships</span>
            </Link>
          </div>

          <div className="flex flex-col items-center m-4">
            <Link href="/admissions" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/Admission_Icon.svg" alt="Admissions" width={36} height={36} className="w-9 h-auto dark-image" />
              </div>
              <span className="text-xl dark:text-gray-100">Admissions</span>
            </Link>
          </div>

          <div className="flex flex-col items-center m-4">
            <Link href="/papers" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/PYQ_Icon.svg" alt="PYQ" width={36} height={36} className="w-9 h-auto dark-image" />
              </div>
              <span className="text-xl dark:text-gray-100">PYQ</span>
            </Link>
          </div>

          <div className="flex flex-col items-center m-4">
            <Link href="/scholarships" className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[70px] h-[70px] bg-[#DFF1FF] rounded-full border-[3.5px] border-[#283D50]">
                <Image src="/Intern_Icon.svg" alt="Internships" width={36} height={36} className="w-9 h-auto dark-image" />
              </div>
              <span className="text-xl dark:text-gray-100">Scholarships</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Line */}
      <div className={`bg-[#015990] dark:bg-gray-950 text-white dark:text-gray-100 h-auto min-h-[50px] py-2 flex flex-col md:flex-row items-center justify-between px-5 relative`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute right-4 rounded-full backdrop-blur-sm"
          style={{
            cursor: 'pointer'
          }}
        >
          <span className="text-xl">{darkMode ? '| ☀️' : '| 🌙'}</span>
        </button>

        {isAuthenticated ? (
          <div className="w-full flex justify-between items-center pr-12">
            <p className="text-xl">Hi, {user.name}</p>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-white dark:text-gray-100 no-underline flex items-center">
                <UserCog className="md:hidden" size={24} />
                <span className="hidden md:inline text-xl">Profile</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xl mb-2 md:mb-0">Register to get the notifications you need</p>
            <div className="flex items-center gap-4 pr-12">
              <Link href="/login" className="text-xl text-white dark:text-gray-100 no-underline">Login</Link>
              <span className="text-xl">|</span>
              <Link href="/register" className="text-xl text-white dark:text-gray-100 no-underline">Register</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;