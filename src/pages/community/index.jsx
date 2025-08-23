import { FaWhatsapp, FaInstagram, FaLinkedin, FaTelegram, FaTwitter } from 'react-icons/fa';
import useScrollToTop from '@/hooks/useScrollToTop';
import Head from 'next/head';

const SocialLink = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="transition-transform hover:scale-110"
  >
    <Icon className="w-8 h-8 text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 transition-colors" />
  </a>
);

const Section = ({ title, description, ctaLink, ctaText }) => (
    <div className="my-8">
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      {ctaLink && (
        <a 
          href={ctaLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[#155990] dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors text-lg"
        >
          {ctaText}
        </a>
      )}
    </div>
  );

const Community = () => {
  useScrollToTop();

  const socialLinks = [
    { href: "https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41", icon: FaWhatsapp },
    { href: "https://www.instagram.com/exameets/", icon: FaInstagram },
    { href: "https://x.com/exameets", icon: FaTwitter },
    { href: "https://www.linkedin.com/company/exameets/", icon: FaLinkedin },
    { href: "https://t.me/exameetschannel", icon: FaTelegram }
  ];

  return (
    <>
      <Head>
        <title>Community | Exameets</title>
        <meta name="description" content="Join the Exameets community and connect with fellow aspirants. Share resources, tips, and stay updated on the latest exam news." />
        <link rel="canonical" href={`https://exameets.in/community`} />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Follow Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Stay connected and up-to-date with the latest news and updates on Exameets by following us on:
        </p>
  
        <div className="flex gap-6 mb-12">
          {socialLinks.map((link, index) => (
            <SocialLink key={index} {...link} />
          ))}
        </div>
  
        <hr className="border-gray-200 dark:border-gray-600 my-12" />
  
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Stay Updated!</h2>
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">Join Our Channels</p>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Don&rsquo;t Miss Out on Important Notifications!
          </p>
        </div>
  
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
          At Exameets, we understand how crucial it is to stay informed about exam dates, 
          job alerts, and other important announcements. Join our WhatsApp and Telegram 
          channels to receive instant updates and ensure you never miss an opportunity!
        </p>
  
        <Section 
          title="Join Us on WhatsApp"
          description="Stay connected with our WhatsApp channel for quick updates and notifications."
          ctaLink="https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41"
          ctaText="Click here to join our WhatsApp channel"
        />
  
        <Section 
          title="Join Us on Telegram"
          description="For in-depth discussions, resources, and alerts, join our Telegram channel."
          ctaLink="https://t.me/exameetschannel"
          ctaText="Click here to join our Telegram channel"
        />
  
        <hr className="border-gray-200 dark:border-gray-600 my-12" />
  
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">How to Join</h3>
        <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-600 dark:text-gray-300">
          <li>
            <span className="font-semibold">Click the link:</span> Use the buttons above to navigate to the respective channel.
          </li>
          <li>
            <span className="font-semibold">Follow the instructions:</span> If prompted, follow the instructions on your app to complete the join process.
          </li>
          <li>
            <span className="font-semibold">Stay Engaged:</span> Make sure to turn on notifications so you never miss an important update!
          </li>
        </ol>
  
        <hr className="border-gray-200 dark:border-gray-600 my-12" />
  
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Help Us Spread the Word!</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Know someone who could benefit from these updates? Share this page and encourage 
          them to join our community!
        </p>
        <p className="text-xl font-semibold text-primary dark:text-blue-400 text-center">
          &ldquo;Stay Informed. Stay Ahead.&rdquo;
        </p>
      </div>
    </div>
    </>
  );  
};

export default Community;