import React, { useState, useEffect } from "react";

const TYPING_TEXT = "Welcome to Exameets";
const TYPING_SPEED = 200; // ms per character
const PAUSE_AFTER_TYPING = 1200; // ms to pause after typing
const PAUSE_AFTER_DELETING = 500; // ms to pause after deleting

const Welcome = () => {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (displayed.length < TYPING_TEXT.length) {
        timeout = setTimeout(() => {
          setDisplayed(TYPING_TEXT.slice(0, displayed.length + 1));
        }, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => setTyping(false), PAUSE_AFTER_TYPING);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(TYPING_TEXT.slice(0, displayed.length - 1));
        }, TYPING_SPEED / 1.5);
      } else {
        timeout = setTimeout(() => setTyping(true), PAUSE_AFTER_DELETING);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing]);

  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-[#dbe8f3] to-[#f0f7ff] dark:bg-gray-800 dark:from-gray-800 dark:to-gray-700 p-10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.08)] relative overflow-hidden flex flex-col justify-center items-center md:items-start text-center md:text-left group">
      
      {/* Animated background elements
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-200/20 dark:bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 left-8 w-16 h-16 bg-blue-300/20 dark:bg-blue-300/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-blue-100/30 dark:bg-blue-500/30 rounded-full animate-pulse delay-500"></div>
      </div> */}

      {/* Main heading with typing effect */}
      <h2 className="mb-2 text-2xl sm:text-4xl md:text-5xl font-bold text-[#002e5b] dark:text-white leading-snug max-w-[90%]">
        {displayed}
        <span className="animate-blink">|</span>
      </h2>
      
      {/* Subtitle with delayed slide-in */}
      <p className="mb-6 text-lg md:text-xl font-semibold text-[#015990] dark:text-blue-200 leading-snug max-w-[90%] transform transition-all duration-700 translate-y-0 opacity-100 animate-[slideInUp_0.8s_ease-out_0.2s_both]">
        Your One-Stop Solution for All Your Aspirations!
      </p>

      {/* Description with fade-in */}
      <p className="my-3 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg max-w-[90%] transform transition-all duration-700 translate-y-0 opacity-100 animate-[fadeInUp_1s_ease-out_0.4s_both] hover:text-gray-800 dark:hover:text-gray-200">
        Exameets is more than just a website – it's a comprehensive platform designed to meet the unique needs of
        students and professionals. Our goal is to provide all the resources you need for your academic journey and
        career progression, from study materials and job notifications to travel support for exams and admissions.
      </p>

      {/* Call to action with scale animation */}
      <p className="mt-8 text-lg sm:text-xl md:text-2xl font-bold text-[#002e5b] dark:text-white leading-snug max-w-[90%] transform transition-all duration-700 translate-y-0 opacity-100 animate-[slideInUp_1s_ease-out_0.6s_both] hover:scale-105 cursor-default">
        Join Exameets today and let us help you achieve your dreams – because here at Exameets, we
        <br />
        <span className="text-3xl text-[#002e5b] dark:text-white font-extrabold">
          "Meet All Your Needs."
        </span>
      </p>

      {/* Animated underline for the tagline */}
      <div className="mt-4 w-32 h-1 bg-gradient-to-r from-[#015990] to-[#002e5b] dark:from-blue-400 dark:to-blue-200 rounded-full transform scale-x-0 animate-[scaleX_0.8s_ease-out_1.2s_forwards] origin-left"></div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s steps(1) infinite;
        }
        
        /* Subtle hover effect for the entire container */
        .group:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease;
        }
        
        .group:hover .shadow-[0_4px_20px_rgba(0,0,0,0.08)] {
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        
        .group:hover .dark\\:shadow-[0_4px_20px_rgba(255,255,255,0.08)] {
          box-shadow: 0 8px 30px rgba(255,255,255,0.12);
        }
      `}</style>
    </div>
  );
};

export default Welcome;