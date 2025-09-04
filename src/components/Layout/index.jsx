'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useTheme } from '@/context/ThemeContext';

const Layout = ({ children }) => {
  const { darkMode } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main>{children}</main>
      {/* Footer: always visible on desktop, only on home page for mobile */}
      <div>
        {/* Only show Footer on mobile for selected pages, always show on desktop */}
        {(() => {
          const footerPages = [
            '/',
            '/contact-us',
            '/about-us',
            '/community',
            '/cookie-policy',
            '/privacy-policy',
            '/terms-of-service',
          ];
          return (
            <div className={`md:block ${footerPages.includes(pathname) ? 'block' : 'hidden'}`}>
              <Footer />
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Layout;