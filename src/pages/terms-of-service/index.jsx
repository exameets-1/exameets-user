import { useEffect } from 'react';
import Link from 'next/link';
import { FaFileContract, FaBullhorn, FaUserCheck, FaExternalLinkAlt, FaShieldAlt, FaCopyright, FaLink, FaExclamationTriangle, FaEdit, FaGavel } from 'react-icons/fa';

const TermsOfService = () => {
    const sections = [
  {
    title: "Introduction",
    content:
      "Welcome to www.exameets.in. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully. If you do not agree, please refrain from using the platform. Our service is supported by advertising through Google AdSense."
  },
  {
    title: "Services Provided",
    content: `www.exameets.in is a job and education portal offering:

1. Links to tech jobs
2. Links to government jobs
3. Links to internship opportunities
4. Links to scholarship information
5. Links to Admission updates
6. Links to Admit card downloads
7. Links to Exam results
8. Previous year question papers (PYQs)
9. Targeted advertising content through Google AdSense

Users can freely browse all listed opportunities, updates, and resources without the need for registration or login. Exameets provides links and information for convenience, and all applications or downloads are redirected to the respective official or third-party websites.

Note: We do not guarantee job placement or admission. Exameets is not affiliated with any government body, university, or recruiting organization.`
  },
  {
    title: "Advertising and Google AdSense",
    content: `Our platform includes advertising served through Google AdSense. By using our platform, you agree that:

1. You will see advertisements while using our services
2. Advertisements may be personalized based on:
   - Your browsing behaviour
   - Geographic location
   - Device information
   - Other factors as described in our Privacy Policy
3. You understand that:
   - We are not responsible for advertiser content
   - Clicking ads will take you to external websites
   - Your interaction with ads is subject to Google's policies
   - You will not engage in invalid click activity
   - You will not interfere with ad delivery

For more information about ad personalization, visit Google's Ad Settings page at https://adssettings.google.com`
  },
  {
    title: "Eligibility",
    content:
      "To access and use our services, you must be at least 13 years old. By using www.exameets.in, you confirm that you meet this age requirement."
  },
  {
    title: "Intellectual Property",
    content: `All content on www.exameets.in, including previous year papers, text, graphics, and logos, is either:
• Original content created by our team
• Curated content collected from publicly available official sources
• Licensed content used with permission
• Public domain content appropriately attributed

Previous year papers are curated and presented for educational purposes:
• Collected from publicly available official sources
• Formatted and organized for ease of access
• Regularly reviewed and updated
• Properly sourced and attributed

We do not claim ownership over official question papers. Our role is limited to curating, formatting, and presenting them for user convenience.

Users may:
• Download and use previous year papers for personal learning
• Share content with appropriate attribution
• Provide feedback and suggestions

Users may not:
• Use content commercially without permission
• Modify or create derivative works
• Remove copyright notices or attributions
• Redistribute content on other platforms without consent

Any unauthorized use of our content may result in legal action.`
  },
  {
    title: "External Links",
    content:
      "Our platform contains links to external websites and advertisements. These links are provided for convenience, and we are not responsible for the content, accuracy, or practices of third-party sites. We regularly verify and update external links, but users should exercise caution when visiting external sites."
  },
  {
    title: "User Responsibilities",
    content: `By using www.exameets.in, you agree to:
1. Use the platform only for lawful purposes
2. Avoid engaging in fraudulent, malicious, or harmful activities
3. Not interfere with the delivery or display of advertisements
4. Not use automated tools or scripts to interact with ads
5. Not engage in invalid click activity
6. Respect intellectual property rights
7. Follow Google AdSense program policies

You must not disrupt the platform's functionality or compromise the experience of other users.`
  },
  {
    title: "Privacy",
    content: (
      <span>
        By using www.exameets.in, you agree to the collection and use of your
        personal information as described in our{" "}
        <Link
          href="/privacy-policy"
          className="text-blue-600 hover:underline dark:text-blue-500"
        >
          Privacy Policy
        </Link>
        . This includes information collected for advertising purposes through
        Google AdSense. Please read our Privacy Policy to understand how we
        protect and manage your data.
      </span>
    )
  },
  {
    title: "Disclaimer and Limitation of Liability",
    content:
      "While www.exameets.in strives to provide accurate and helpful information, we are not responsible for any damages, losses, or issues that may arise from using our platform, including external links or advertisements. We do not endorse specific products or services advertised through Google AdSense. Users should verify information independently and use all resources at their own risk. Exameets is not affiliated with any government authority, examination board, or recruitment agency."
  },
  {
    title: "Content and Quality Standards",
    content: `We maintain high standards for all content on our platform:
1. Previous Year Papers and educational content:
   - Curated and formatted by our team
   - Regularly reviewed and updated
   - Properly sourced and attributed
2. External links:
   - Regularly verified for validity
   - Checked for appropriate content
   - Promptly updated when necessary
3. Advertising content:
   - Delivered through Google AdSense
   - Subject to Google's content policies
   - Monitored for quality and relevance`
  },
  {
    title: "Governing Law and Jurisdiction",
    content:
      "These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of this platform will be subject to the exclusive jurisdiction of the courts in India. While the platform primarily targets users in India, it is accessible globally, and users from other regions must comply with their local laws."
  },
  {
    title: "Amendments to Terms",
    content:
      "www.exameets.in reserves the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the updated Terms will take effect immediately upon posting. Users are encouraged to review the Terms periodically to stay informed of any changes."
  }
];


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] via-white to-[#d5e5f6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-[#015990] dark:border-[#015990]">
          <div className="px-6 py-10">
            <div className="flex flex-col items-center mb-8">
              <FaFileContract className="text-[#015990] dark:text-[#90cdf4] text-5xl mb-2 animate-bounce" />
              <h1 className="text-4xl font-extrabold text-center text-[#015990] dark:text-[#90cdf4] mb-2 tracking-tight">
                Terms and Conditions
              </h1>
              <span className="text-sm text-[#015990] dark:text-[#90cdf4] font-bold bg-[#eaf6fb] dark:bg-[#015990]/30 px-3 py-1 rounded-full shadow">
                Effective Date: September 5, 2025
              </span>
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => {
                // Icon selection for section
                let icon = null;
                if (section.title.toLowerCase().includes('introduction')) icon = <FaFileContract className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('services')) icon = <FaBullhorn className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('advertising')) icon = <FaBullhorn className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('eligibility')) icon = <FaUserCheck className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('intellectual property')) icon = <FaCopyright className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('external links')) icon = <FaExternalLinkAlt className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('user responsibilities')) icon = <FaShieldAlt className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('privacy')) icon = <FaShieldAlt className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('disclaimer')) icon = <FaExclamationTriangle className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('content and quality')) icon = <FaEdit className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('governing law')) icon = <FaGavel className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('amendments')) icon = <FaEdit className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;

                return (
                  <div key={index} className="border-l-4 border-[#015990] dark:border-[#015990] bg-[#eaf6fb] dark:bg-[#015990]/10 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-3">
                      {icon}
                      <h2 className="text-2xl font-bold text-[#015990] dark:text-[#90cdf4]">
                        {section.title}
                      </h2>
                    </div>
                    <div className="text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line text-base">
                      {section.content}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-[#015990] dark:text-[#90cdf4] text-center">
              Thank you for using www.exameets.in. If you have any questions or concerns, feel free to contact us at our official email address.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;