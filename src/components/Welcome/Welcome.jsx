import React from "react";
import { motion } from "framer-motion";

// ✅ Custom Hook for Typing Effect
const useTypingEffect = (text, typingSpeed = 150, pause = 1000) => {
  const [displayed, setDisplayed] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    let timer;

    if (!deleting && index < text.length) {
      timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, typingSpeed);
    } else if (!deleting && index === text.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && index > 0) {
      timer = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, -1));
        setIndex((i) => i - 1);
      }, typingSpeed / 1.5);
    } else if (deleting && index === 0) {
      timer = setTimeout(() => setDeleting(false), pause / 2);
    }

    return () => clearTimeout(timer);
  }, [index, deleting, text, typingSpeed, pause]);

  return displayed;
};

const Welcome = () => {
  const displayed = useTypingEffect("Welcome to Exameets");

  return (
    <section
      role="banner"
      className={`
        hidden md:flex flex-col flex-1
        justify-center items-center md:items-start
        bg-[#d5e5f6] dark:bg-gray-800
        rounded-lg shadow-md
        p-5
        min-h-[32rem] h-full
        max-w-6xl
        mx-auto
      `}
      style={{
        // Ensures it matches WhatsNew's container
        boxSizing: "border-box",
      }}
    >
      {/* Typing heading */}
      <motion.h2
        className="mb-2 text-2xl sm:text-4xl md:text-5xl font-bold text-[#002e5b] dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {displayed}
        <span className="animate-blink">|</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="mb-6 text-lg md:text-xl font-semibold text-[#015990] dark:text-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Your One-Stop Solution for All Your Aspirations!
      </motion.p>

      {/* Description */}
      <motion.p
        className="my-3 text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-[90%] hover:text-gray-800 dark:hover:text-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        Exameets is more than just a website – it's a comprehensive platform designed
        to meet the unique needs of students and professionals. From study materials
        and job notifications to travel support, we’ve got you covered.
      </motion.p>

      {/* Call to Action */}
      <motion.p
        className="mt-8 text-lg sm:text-xl md:text-2xl font-bold text-[#002e5b] dark:text-white leading-snug 
                   hover:scale-105 cursor-default transition-transform"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        Join Exameets today and let us help you achieve your dreams –
        <br />
        <span className="text-3xl text-[#002e5b] dark:text-white font-extrabold">
          "Meet All Your Needs."
        </span>
      </motion.p>

      {/* Animated underline */}
      <motion.div
        className="mt-4 w-32 h-1 bg-gradient-to-r from-[#015990] to-[#002e5b] dark:from-blue-400 dark:to-blue-200 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ originX: 0 }}
      />

      {/* Cursor Blink */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </section>
  );
};

export default Welcome;
