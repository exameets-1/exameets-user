const Welcome = () => {
  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-[#dbe8f3] to-[#f0f7ff] dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 p-10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)] relative overflow-hidden flex flex-col justify-center items-center md:items-start text-center md:text-left">
      <h2 className="mb-6 text-2xl md:text-3xl font-bold text-[#002e5b] dark:text-white leading-snug max-w-[90%]">
        <b>Welcome to Exameets – Your One-Stop Solution for All Your Aspirations!</b>
      </h2>
      
      <p className="my-3 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg max-w-[90%]">
        Exameets is more than just a website – it's a comprehensive platform designed to meet the unique needs of
        students and professionals. Our goal is to provide all the resources you need for your academic journey and
        career progression, from study materials and job notifications to travel support for exams and admissions.
      </p>
      
      <p className="mt-8 text-[#002e5b] dark:text-white leading-relaxed font-bold text-lg md:text-xl max-w-[90%]">
        <b>Join Exameets today and let us help you achieve your dreams – because here at Exameets, we "Meet All Your
          Needs."</b>
      </p>
    </div>
  );
};

export default Welcome;