import { useEffect } from 'react';
import { FaUserShield, FaUserCheck, FaInfoCircle, FaAd, FaUserEdit, FaTrashAlt, FaShareAlt, FaEnvelopeOpenText } from 'react-icons/fa';

const PrivacyPolicy = () => {

      const sections = [
    {
      title: "Welcome to Exameets",
      content: "Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal data when you use our website. By accessing or using our services, you agree to this Privacy Policy. We are committed to transparency and protecting your privacy rights while providing our services supported by advertising."
    },
    {
      title: "Eligibility",
      content: `• Our website is not intended for users under the age of 13
• During registration, users must confirm they are at least 13 years old through a required checkbox
• We do not knowingly collect or store data from users under 13
• If we discover we have collected data from a user under 13, we will promptly delete it`
    },
    {
      title: "Information We Collect",
      content: `Mandatory Information:
• Email Address:
  - Used for account login and authentication
  - Ensures account uniqueness
  - Required for account-related notifications
• Password:
  - Stored securely using industry-standard hashing algorithms
  - Never stored in plaintext
  - Protected with secure HTTP-only cookies
• Full Name:
  - Used for user identification across the platform
  - May be displayed in profiles, job applications
  - Helps personalize communication
• Gender:  
  - Collected for demographic insights and to improve overall user experience  
  - Used in aggregated form for internal statistics  
  - Not publicly displayed
• Date of Birth:  
  - Helps us verify age eligibility and understand user demographics  
  - Used in aggregated form for internal statistics and personalization  
  - Not publicly displayed
• Phone Number:
  - Currently collected but not in active use
  - Planned for future account recovery via SMS/WhatsApp

Optional / Profile Information:
• Notification Preferences:
  - Used to send you relevant updates such as job alerts, exam results, or scholarships
  - Can be updated anytime in your account settings
• Education Status:
  - Collected to understand user demographics
  - Used internally for statistical analysis
• Highest Qualification:
  - Collected to improve recommendations and for internal statistics
  - Not publicly displayed

Technical & Advertising Data:
• Theme preferences (light/dark mode)
• Session information
• Browser type and version
• Device type and operating system
• Anonymous usage statistics
• IP address (for geographic targeting)
• Geographic location (country/city level)
• Ad interaction data
• Browser cookies and similar technologies`
    },
    {
      title: "Advertising and Google AdSense",
      content: `We use Google AdSense to display advertisements on our website. Google AdSense and its certified vendors may use cookies and similar technologies to:

• Show personalized ads based on:
  - Your previous visits to our site
  - Your interests and online behavior
  - Geographic location
  - Browser and device information

• Measure and improve ad performance:
  - Track ad impressions and clicks
  - Analyze user interactions
  - Optimize ad delivery

• Ensure quality and security:
  - Prevent repetitive ads
  - Combat fraud and abuse
  - Verify proper ad display

You can learn more about how Google uses data by visiting Google's Privacy & Terms page at https://policies.google.com/technologies/partner-sites

Ad Personalization Controls:
• Opt out via Google Ad Settings (https://adssettings.google.com)
• Use Network Advertising Initiative opt-out (http://www.networkadvertising.org/choices/)
• Adjust your browser's cookie settings
• Enable "Do Not Track" in your browser`
    },
    {
      title: "How We Use Your Information",
      content: `Authentication and Security:
• Email address for account authentication
• Password for secure access
• Session management and security

Account Features:
• Phone number reserved for future account recovery

User Experience:
• Theme preferences for personalized display
• Anonymous analytics to improve website performance
• Session data for security and functionality

Advertising:
• Deliver relevant advertisements through Google AdSense
• Improve ad targeting and performance
• Ensure compliance with advertising policies

Communication:
• Account-related notifications
• Optional recommendations based on preferences
• Important updates about our service`
    },
    {
      title: "User Rights",
      content: `Access Rights:
• View all stored personal data through dashboard
• Export personal data in a machine-readable format
• Request detailed information about data usage

Update Rights:
• Modify personal information through dashboard
• Update preferences and settings
• Email address cannot be modified (core identifier)

Delete Rights:
• Permanent account deletion through dashboard
• Immediate removal of all associated data
• No recovery option after deletion
• Option to delete specific data points while maintaining account

Control Rights:
• Manage cookie preferences
• Control email notifications
• Opt out of analytics
• Modify theme preferences
• Control ad personalization through Google Ad Settings`
    },
    {
      title: "Data Retention Policy",
      content: `Active Accounts:
• Data retained as long as account remains active
• Regular reviews of stored data relevance
• Option to manually delete specific data points

Deleted Accounts:
• Immediate permanent deletion of all user data
• No backup retention of deleted account data
• Complete removal from all systems

Technical & Advertising Data:
• Analytics data retained for max 26 months
• Session data deleted after session ends
• Advertising cookies per Google AdSense policies
• Cookies expire based on their specific purpose

Future Implementations:
• If backups are implemented, deleted data will be removed within 30 days
• Regular data cleanup processes
• Automated data minimization procedures`
    },
    {
      title: "Data Sharing and Third Parties",
      content: `Data Sharing Policy:
• We do not sell user data
• Limited sharing with essential service providers
• Data shared with Google for advertising purposes

Third-Party Services:
• Google AdSense:
  - Provides advertising services
  - Uses cookies for ad personalization
  - Has independent privacy policy
• Google Analytics with privacy-focused configuration:
  - IP anonymization enabled
  - Limited data retention
  - Strict cookie controls

Data Processing:
• All processing occurs on secure servers
• External processors limited to essential services
• Strict data access controls`
    },
    {
      title: "Contact Information",
      content: `For privacy-related inquiries:
• Use our feedback form in the Contact Us page
• Email our privacy team
• Response within 48 business hours
• Official support channels listed in footer

For urgent concerns:
• Dedicated privacy contact form
• Priority response for data-related issues
• Clear escalation process
• Documentation requirements

For advertising-related inquiries:
• Visit Google Ad Settings for personalization controls
• Use our feedback form for general ad questions
• Report inappropriate ads through Google AdSense`
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
              <FaUserShield className="text-[#015990] dark:text-[#90cdf4] text-5xl mb-2 animate-bounce" />
              <h1 className="text-4xl font-extrabold text-center text-[#015990] dark:text-[#90cdf4] mb-2 tracking-tight">
                Privacy Policy
              </h1>
              <span className="text-sm text-[#015990] dark:text-[#90cdf4] font-medium bg-[#eaf6fb] dark:bg-[#015990]/30 px-3 py-1 rounded-full shadow">
                Effective Date: September 5, 2025
              </span>
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => {
                // Icon selection for section
                let icon = null;
                if (section.title.toLowerCase().includes('eligibility')) icon = <FaUserCheck className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('information')) icon = <FaInfoCircle className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('advertising')) icon = <FaAd className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('use your information')) icon = <FaUserEdit className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('user rights')) icon = <FaUserEdit className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('data retention')) icon = <FaTrashAlt className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('data sharing')) icon = <FaShareAlt className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('contact')) icon = <FaEnvelopeOpenText className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;
                if (section.title.toLowerCase().includes('welcome')) icon = <FaUserShield className="text-[#015990] dark:text-[#90cdf4] text-xl mr-2" />;

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

            <div className="mt-12 flex flex-col items-center">
              <FaUserShield className="text-[#015990] dark:text-[#90cdf4] text-3xl mb-2" />
              <span className="text-sm text-[#015990] dark:text-[#90cdf4] text-center">Your privacy and security are our top priority.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;