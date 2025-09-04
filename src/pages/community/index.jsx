import { FaWhatsapp, FaInstagram, FaLinkedin, FaTelegram, FaTwitter } from 'react-icons/fa';
import useScrollToTop from '@/hooks/useScrollToTop';
import Head from 'next/head';

const SocialLink = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="transition-transform hover:scale-110 flex items-center justify-center w-12 h-12 rounded-full bg-[#eaf6fb] dark:bg-[#015990]/10 border border-[#015990] dark:border-[#90cdf4]"
    style={{ minWidth: 48, minHeight: 48 }}
  >
    <Icon className="w-7 h-7 text-[#015990] dark:text-[#90cdf4]" />
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
        className="block w-full sm:w-auto px-6 py-3 bg-[#015990] dark:bg-blue-600 text-white rounded-lg hover:bg-[#0788d8] dark:hover:bg-blue-700 transition-colors text-lg text-center font-semibold"
        style={{ wordBreak: 'break-word' }}
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
      <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] via-white to-[#d5e5f6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-[#015990] dark:border-[#015990] px-8 py-10">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-4xl font-extrabold text-center text-[#015990] dark:text-[#90cdf4] mb-2 tracking-tight">
                Community
              </h1>
              <span className="text-sm text-[#015990] dark:text-[#90cdf4] font-medium bg-[#eaf6fb] dark:bg-[#015990]/30 px-3 py-1 rounded-full shadow">
                Connect, Share, and Stay Updated
              </span>
            </div>

            <div className="space-y-10 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
              <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4] mb-4">Follow Us</h2>
                <p className="mb-6">
                  Stay connected and up-to-date with the latest news and updates on Exameets by following us on:
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-4">
                  {socialLinks.map((link, index) => (
                    <SocialLink key={index} {...link} />
                  ))}
                </div>
              </div>

              <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4] mb-4">Stay Updated!</h2>
                <p className="mb-2 font-semibold">Join Our Channels</p>
                <p className="mb-6">Don&rsquo;t Miss Out on Important Notifications!</p>
                <p className="mb-6">
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
              </div>

              <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                <h3 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4] mb-4">How to Join</h3>
                <ol className="list-decimal pl-6 space-y-4">
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
              </div>

              <div className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4] mb-4">Help Us Spread the Word!</h2>
                <p className="mb-4">
                  Know someone who could benefit from these updates? Share this page and encourage
                  them to join our community!
                </p>
                <p className="text-xl font-semibold text-[#015990] dark:text-[#90cdf4] text-center">
                  &ldquo;Stay Informed. Stay Ahead.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );  
};

export default Community;