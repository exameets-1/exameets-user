'use client';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useTheme } from '@/context/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode } = useTheme();

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <html lang="en">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </html>
  );
};

export default Layout;