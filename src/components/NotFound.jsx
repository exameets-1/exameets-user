import { Link } from 'next/navigation';

const NotFound = () => {
  return (
    <section className="notfound min-h-screen flex items-center justify-center px-4">
      <div className="content text-center">
        {/* Image only shows on md (medium) screens and up */}
        <img 
          src="/notfound.jpg" 
          alt="404 Not Found" 
          className="hidden md:block max-w-[400px] mx-auto mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">404 Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your Visited Page Not Found. You may go home page.
        </p>
        <Link 
          href={"/"} 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to home page
        </Link>
      </div>
    </section>
  );
};

export default NotFound;