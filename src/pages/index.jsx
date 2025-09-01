'use client'

import Welcome from '@/components/Welcome/Welcome';
import WhatsNew from '@/components/WhatsNew/WhatsNew';
import SelectedJobs from '@/components/SelectedJobs/SelectedJobs';
import SocialModal from '@/components/SocialModal';
import { useSelector } from 'react-redux';
import scrollToTop from '@/hooks/useScrollToTop';
import Head from 'next/head';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
    <Head>
        <title>Exameets</title>
        <meta name="description" content="Welcome to Exameets - Your gateway to success." />
        <link rel="canonical" href={`https://exameets.in`} />
    </Head>
    {scrollToTop()}
    <div className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-2xl mx-auto h-full">
        {isAuthenticated ? (
          <SelectedJobs className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        ) : (
          <div className="hidden md:block h-full bg-gray-100 dark:bg-gray-800 p-5">
            <Welcome className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
        )}
        <WhatsNew className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
      </div>
      <SocialModal />
    </div>
    </>
  );
};

export default Home;