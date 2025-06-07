import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "The expert in anything was once a beginner. – Helen Hayes",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "The beautiful thing about learning is that nobody can take it away from you. – B.B. King",
  "Don’t let what you cannot do interfere with what you can do. – John Wooden",
  "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
  "Dream big and dare to fail. – Norman Vaughan",
  "It’s not about how bad you want it. It’s about how hard you’re willing to work for it. – Anonymous",
  "You don’t have to be great to start, but you have to start to be great. – Zig Ziglar",
  "Success doesn’t come to you, you go to it. – Marva Collins",
  "You are braver than you believe, stronger than you seem, and smarter than you think. – A.A. Milne",
  "Our greatest glory is not in never falling, but in rising every time we fall. – Confucius",
  "Hard work beats talent when talent doesn’t work hard. – Tim Notke",
  "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
  "A person who never made a mistake never tried anything new. – Albert Einstein",
  "Your time is limited, don’t waste it living someone else’s life. – Steve Jobs",
  "I find that the harder I work, the more luck I seem to have. – Thomas Jefferson",
  "The best way to predict your future is to create it. – Abraham Lincoln",
  "Learning never exhausts the mind. – Leonardo da Vinci",
  "Strive for progress, not perfection. – Anonymous",
  "Education is the key to unlocking the world, a passport to freedom. – Oprah Winfrey",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Be a student as long as you still have something to learn, and this will mean all your life. – Henry L. Doherty",
  "Study while others are sleeping; work while others are loafing; prepare while others are playing; and dream while others are wishing. – William A. Ward",
  "Success is stumbling from failure to failure with no loss of enthusiasm. – Winston Churchill",
  "Genius is 1% inspiration, 99% perspiration. – Thomas Edison",
  "Strive not to be a success, but rather to be of value. – Albert Einstein",
  "Discipline is the bridge between goals and accomplishment. – Jim Rohn",
  "If you don’t sacrifice for what you want, what you want becomes the sacrifice. – Anonymous",
  "Success usually comes to those who are too busy to be looking for it. – Henry David Thoreau",
  "Fall seven times, stand up eight. – Japanese Proverb",
  "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
  "Persistence guarantees that results are inevitable. – Paramahansa Yogananda",
  "Great works are performed not by strength but by perseverance. – Samuel Johnson",
  "Do not give up, the beginning is always the hardest. – Anonymous",
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. – Brian Herbert",
  "An investment in knowledge pays the best interest. – Benjamin Franklin",
  "A mind, once stretched by a new idea, never regains its original dimensions. – Oliver Wendell Holmes Sr.",
  "The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as we continue to live. – Mortimer Adler",
  "Education is the movement from darkness to light. – Allan Bloom",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "Success is not how high you have climbed, but how you make a positive difference to the world. – Roy T. Bennett",
  "The secret of getting ahead is getting started. – Mark Twain",
  "Work hard, be kind, and amazing things will happen. – Conan O'Brien",
  "Perseverance is not a long race; it is many short races one after the other. – Walter Elliot",
  "The man who moves a mountain begins by carrying away small stones. – Confucius",
  "Don’t count the days, make the days count. – Muhammad Ali",
  "The road to success and the road to failure are almost exactly the same. – Colin R. Davis",
  "Push yourself because no one else is going to do it for you. – Anonymous",
  "Success doesn’t just find you. You have to go out and get it. – Anonymous",
  "I never dreamed about success. I worked for it. – Estée Lauder",
  "Opportunities are usually disguised as hard work, so most people don’t recognize them. – Ann Landers",
  "Keep going. Everything you need will come to you at the perfect time. – Anonymous",
  "You may encounter many defeats, but you must not be defeated. – Maya Angelou",
  "Success is achieved and maintained by those who try and keep trying. – W. Clement Stone",
  "Don’t let yesterday take up too much of today. – Will Rogers",
  "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will. – Vince Lombardi",
  "Challenges are what make life interesting. Overcoming them is what makes life meaningful. – Joshua J. Marine",
  "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart. – Roy T. Bennett",
  "Success is how high you bounce when you hit bottom. – George S. Patton",
  "Strength grows in the moments when you think you can’t go on but you keep going anyway. – Anonymous",
  "What seems to us as bitter trials are often blessings in disguise. – Oscar Wilde",
  "Courage doesn’t always roar. Sometimes courage is the quiet voice at the end of the day saying, ‘I will try again tomorrow.’ – Mary Anne Radmacher",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "Nothing will work unless you do. – Maya Angelou",
  "Doubt kills more dreams than failure ever will. – Suzy Kassem",
  "Obstacles don’t have to stop you. If you run into a wall, don’t turn around and give up. Figure out how to climb it, go through it, or work around it. – Michael Jordan",
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "Pain is temporary. Quitting lasts forever. – Lance Armstrong",
  "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway. – Earl Nightingale",
  "Winners never quit, and quitters never win. – Vince Lombardi",
  "Don’t wait for opportunity. Create it. – Anonymous",
  "What you get by achieving your goals is not as important as what you become by achieving your goals. – Zig Ziglar",
  "Every strike brings me closer to the next home run. – Babe Ruth",
  "Turn your wounds into wisdom. – Oprah Winfrey",
  "The more you dream, the farther you get. – Michael Phelps",
  "Never let success get to your head and never let failure get to your heart. – Anonymous",
  "A winner is a dreamer who never gives up. – Nelson Mandela",
  "Knowledge will bring you the opportunity to make a difference. – Claire Fagin",
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. – Malcolm X",
  "Reading is essential for those who seek to rise above the ordinary. – Jim Rohn",
  "The more you know, the more you realize you don’t know. – Aristotle",
  "The roots of education are bitter, but the fruit is sweet. – Aristotle",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. – Mahatma Gandhi",
  "Develop a passion for learning. If you do, you will never cease to grow. – Anthony J. D’Angelo",
  "Don’t let your learning lead to knowledge. Let your learning lead to action. – Jim Rohn",
  "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence. – Abigail Adams",
  "The secret to getting ahead is getting started. – Mark Twain",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Don’t count the days, make the days count. – Muhammad Ali"
]

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      return motivationalQuotes[randomIndex];
    };

    const updateQuote = () => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentQuote(getRandomQuote()); // Change quote while invisible
        setIsVisible(true); // Start fade in
      }, 1000); // Wait for fade out to complete
    };

    // Update quote every 5 seconds
    const intervalId = setInterval(updateQuote, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="bg-[#015990] dark:bg-gray-950 text-white dark:text-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center py-4">
          <h1 className="font-bold text-2xl text-white dark:text-gray-100 font-sans">Exameets</h1>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 py-4">
          <Link href="/contact-us" className="text-white dark:text-gray-100 no-underline hover:underline">Contact Us</Link>
          <span className="text-white dark:text-gray-100">|</span>
          <Link href="/about-us" className="text-white dark:text-gray-100 no-underline hover:underline">About Us</Link>
          <span className="text-white dark:text-gray-100">|</span>
          <Link href="/community" className="text-white dark:text-gray-100 no-underline hover:underline">Community</Link>
          <span className="text-white dark:text-gray-100">|</span>
          <Link href="/privacy-policy" className="text-white dark:text-gray-100 no-underline hover:underline">Privacy Policy</Link>
          <span className="text-white dark:text-gray-100">|</span>
          <Link href="/teams" className="text-white dark:text-gray-100 no-underline hover:underline">Our Team</Link>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center px-8 py-4 border-t dark:border-gray-700 border-white border-opacity-10 max-md:flex-col max-md:items-center max-md:gap-4">
          <div className="text-sm">
            <p className="text-white dark:text-gray-100"> 2025 Exameets. All Rights Reserved.</p>
          </div>
          
          <div className="text-sm">
            <p className="text-white dark:text-gray-100">Developed in Partnership with{' '}
              <a 
                href="https://www.ceeras.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-white dark:text-gray-100"
              >
                Ceeras
              </a>
            </p>
          </div>
          
          <div className="flex gap-4">
            <a href="https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} />
            </a>
            <a href="https://www.instagram.com/exameets/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://x.com/exameets" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={24} />
            </a>
            <a href="https://www.linkedin.com/company/exameets/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
            <a href="https://t.me/exameetschannel" target="_blank" rel="noopener noreferrer">
              <FaTelegram size={24} />
            </a>
          </div>
        </div>
        <div className="border-t dark:border-gray-700 border-white border-opacity-10 py-2 text-center text-sm">
          <p className="text-white dark:text-gray-100">
              Developed by{' '}
            <a href="https://www.linkedin.com/in/santhosh-anantha-9b4603297/" target='_blank' rel="noopener noreferrer" className="hover:underline">Anusha Mayaluri</a>{' '}
            and{' '}
            <a href="https://www.linkedin.com/in/mayaluri-anusha/" target='_blank' rel="noopener noreferrer" className="hover:underline">Santhosh Anantha</a>
          </p>
        </div>

        {/* Quotes */}
        <div className="border-t dark:border-gray-700 pt-2">
          <div className={`text-center transition-opacity duration-1000 min-h-[2em] ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {currentQuote}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
