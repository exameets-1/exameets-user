import Link from 'next/link';
import Head from 'next/head';
import useScrollToTop from '../../hooks/useScrollToTop';
import { FaUsers, FaBullseye, FaEye, FaStar } from 'react-icons/fa';

const AboutUs = () => {
    useScrollToTop();

    return (
      <>
        <Head>
          <title>About Us | Exameets</title>
          <meta name="description" content="Learn more about Exameets, our mission, vision, and the services we offer to students and job seekers." />
          <link rel="canonical" href="https://exameets.in/about-us" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] via-white to-[#d5e5f6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-[#015990] dark:border-[#015990]">
              <div className="px-6 py-10">
                <div className="flex flex-col items-center mb-8">
                  <FaUsers className="text-[#015990] dark:text-[#90cdf4] text-5xl mb-2 animate-bounce" />
                  <h1 className="text-4xl font-extrabold text-center text-[#015990] dark:text-[#90cdf4] mb-2 tracking-tight">
                    Welcome to Exameets
                  </h1>
                  <span className="text-sm text-[#015990] dark:text-[#90cdf4] font-medium bg-[#eaf6fb] dark:bg-[#015990]/30 px-3 py-1 rounded-full shadow">
                    Empowering Students & Job Seekers
                  </span>
                </div>
                <div className="space-y-10 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
                  <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaBullseye className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />
                      <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4]">Our Mission</h2>
                    </div>
                    <p>
                      Exameets is designed to simplify the journey for students and professionals by creating
                      a comprehensive, end-to-end support system. We understand the multiple challenges faced,
                      from <span className="text-[#015990] dark:text-[#90cdf4] font-semibold">travel and preparation to accessing resources</span>.
                    </p>
                    <p>
                      We began as a website, but Exameets will soon launch an app, featuring a richer user
                      experience. As we scale, our services will cover:
                    </p>
                    <ul className="list-square list-inside text-[#015990] dark:text-[#90cdf4] space-y-4 pl-4">
                      <li className="text-gray-800 dark:text-gray-300">Job updates and study materials</li>
                      <li className="text-gray-800 dark:text-gray-300">Travel essentials</li>
                      <li className="text-gray-800 dark:text-gray-300">E-commerce for exam-specific items</li>
                    </ul>
                    <p>
                      Our future plans include setting up an institute and university to meet the needs of
                      modern learners through hands-on, quality education.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaEye className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />
                      <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4]">Our Vision</h2>
                    </div>
                    <p>
                      We envision Exameets as a <span className="text-[#015990] dark:text-[#90cdf4] font-semibold">one-stop solution for success</span>, where students and
                      aspiring job seekers can find everything they need. Our goal is to create a future
                      where access to opportunities and resources is inclusive and seamless for all.
                    </p>
                    <p>
                      Exameets prioritizes exclusive support for women, empowering them to reach their
                      educational and professional goals with confidence and independence.
                    </p>
                  </div>
                  <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-3">
                      <FaStar className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />
                      <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4]">Why Choose Exameets?</h2>
                    </div>
                    <ul className="list-square list-inside space-y-4 pl-4 text-gray-800 dark:text-gray-300">
                      <li>
                        <strong className="text-[#015990] dark:text-[#90cdf4]">Comprehensive Support & Independence:</strong> Make your academic and professional journey secure and reliable, with a focus on empowering young women.
                      </li>
                      <li>
                        <strong className="text-[#015990] dark:text-[#90cdf4]">Vision for the Future:</strong> Exameets is committed to providing quality education and excellent services to foster long-term success.
                      </li>
                    </ul>
                    <p>
                      Join the revolution at Exameets, where all your academic and career needs are united in one place.
                    </p>
                  </div>
                  <div className="flex justify-center mt-8">
                    <Link href="/register">
                      <button className="bg-[#015990] dark:bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-medium hover:bg-[#0788d8] dark:hover:bg-blue-400 transition-colors">
                        Join Us Today
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default AboutUs;