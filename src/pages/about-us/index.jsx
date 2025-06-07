import Link from 'next/link';
import useScrollToTop from '../../hooks/useScrollToTop';

const AboutUs = () => {
    useScrollToTop();
    return (
        <div className="w-11/12 max-w-[1600px] mx-auto my-2 p-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="text-[#015990] dark:text-blue-300 text-3xl md:text-4xl font-bold text-center mb-8">
            Welcome to Exameets
          </div>
      
          <div className="space-y-6 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
            <p>
              Welcome to Exameets - a platform dedicated to meeting the crucial needs of{' '}
              <span className="text-[#015990] dark:text-blue-300 font-semibold">
                students, job seekers, and career-driven individuals
              </span>.
              Whether you're preparing for an exam or gearing up for an interview, Exameets provides
              the necessary resources and connections to make each step easier.
            </p>
      
            <h2 className="text-[#015990] dark:text-blue-300 text-2xl font-semibold mt-6 pb-2 border-b-2 border-[#015990] dark:border-blue-400">
              Our Mission
            </h2>
            <p>
              Exameets is designed to simplify the journey for students and professionals by creating
              a comprehensive, end-to-end support system. We understand the multiple challenges faced,
              from{' '}
              <span className="text-[#015990] dark:text-blue-300 font-semibold">
                travel and preparation to accessing resources
              </span>.
            </p>
            <p>
              We began as a website, but Exameets will soon launch an app, featuring a richer user
              experience. As we scale, our services will cover:
            </p>
            <ul className="list-square list-inside text-[#015990] dark:text-blue-300 space-y-4 pl-4">
              <li className="text-gray-800 dark:text-gray-300">Job updates and study materials</li>
              <li className="text-gray-800 dark:text-gray-300">Travel essentials</li>
              <li className="text-gray-800 dark:text-gray-300">E-commerce for exam-specific items</li>
            </ul>
            <p>
              Our future plans include setting up an institute and university to meet the needs of
              modern learners through hands-on, quality education.
            </p>
      
            <h2 className="text-[#015990] dark:text-blue-300 text-2xl font-semibold mt-6 pb-2 border-b-2 border-[#015990] dark:border-blue-400">
              Our Vision
            </h2>
            <p>
              We envision Exameets as a{' '}
              <span className="text-[#015990] dark:text-blue-300 font-semibold">
                one-stop solution for success
              </span>, where students and
              aspiring job seekers can find everything they need. Our goal is to create a future
              where access to opportunities and resources is inclusive and seamless for all.
            </p>
            <p>
              Exameets prioritizes exclusive support for women, empowering them to reach their
              educational and professional goals with confidence and independence.
            </p>
      
            <h2 className="text-[#015990] dark:text-blue-300 text-2xl font-semibold mt-6 pb-2 border-b-2 border-[#015990] dark:border-blue-400">
              Why Choose Exameets?
            </h2>
            <ul className="list-square list-inside space-y-4 pl-4 text-gray-800 dark:text-gray-300">
              <li>
                <strong className="text-[#015990] dark:text-blue-300">
                  Comprehensive Support & Independence:
                </strong>{' '}
                Make your academic and professional journey secure and reliable, with a focus on empowering young women.
              </li>
              <li>
                <strong className="text-[#015990] dark:text-blue-300">
                  Vision for the Future:
                </strong>{' '}
                Exameets is committed to providing quality education and excellent services to foster long-term success.
              </li>
            </ul>
            <p>
              Join the revolution at Exameets, where all your academic and career needs are united in one place.
            </p>
      
            <div className="flex justify-center mt-8">
              <Link href="/register">
                <button className="bg-[#015990] dark:bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-medium hover:bg-[#0788d8] dark:hover:bg-blue-400 transition-colors">
                  Join Us Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      );      
};

export default AboutUs;