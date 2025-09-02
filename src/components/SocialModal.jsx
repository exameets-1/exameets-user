// // components/SocialModal.js
// import { useState, useEffect } from 'react';
// import { FaWhatsapp,FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from 'react-icons/fa';
// import { X } from 'lucide-react';

// const SocialModal = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     // Check if the modal has been shown before
//     const hasModalBeenShown = document.cookie.includes('socialModalShown=true');
    
//     if (!hasModalBeenShown) {
//       setIsOpen(true);
//       // Set cookie to expire in 30 days
//       const expiryDate = new Date();
//       expiryDate.setDate(expiryDate.getDate() + 30);
//       document.cookie = `socialModalShown=true; expires=${expiryDate.toUTCString()}; path=/`;
//     }
//   }, []);

//   if (!isOpen) return null;

//   const socialLinks = [
//     { name: 'Twitter', url: 'https://x.com/exameets' , logo: FaTwitter },
//     { name: 'LinkedIn', url: 'https://www.linkedin.com/company/exameets/' , logo: FaLinkedin },
//     { name: 'Instagram', url: 'https://www.instagram.com/exameets/' , logo: FaInstagram },
//     { name: 'Telegram', url: 'https://t.me/exameetschannel' , logo: FaTelegram },
//     { name: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41' , logo: FaWhatsapp }
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Join Our Community!</h2>
//           <button
//             name='close'
//             aria-label="Close"
//             onClick={() => setIsOpen(false)}
//             className="p-1 hover:bg-gray-100 rounded-full"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         <p className="text-gray-600 mb-6">
//           Stay updated with our latest news and updates by following us on social media!
//         </p>
        
//         <div className="space-y-4">
//           {socialLinks.map((social) => (
//             <a
//               key={social.name}
//               href={social.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block w-full text-center py-2 px-4 rounded bg-[#015990] text-white hover:bg-[#01467c] transition-colors"
//             >
//                 <div className="flex items-center justify-center">
//                     <social.logo size={24}/>
//                     <span className="ml-2">Subscribe on {social.name}</span>
//                 </div>
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialModal;

// components/SocialModal.js
// import { useState, useEffect } from 'react';
// import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from 'react-icons/fa';
// import { X } from 'lucide-react';

// const SocialModal = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const hasModalBeenShown = document.cookie.includes('socialModalShown=true');

//     if (!hasModalBeenShown) {
//       setIsOpen(true);
//       const expiryDate = new Date();
//       expiryDate.setDate(expiryDate.getDate() + 30);
//       document.cookie = `socialModalShown=true; expires=${expiryDate.toUTCString()}; path=/`;
//     }
//   }, []);

//   if (!isOpen) return null;

//   const socialLinks = [
//     { name: 'Twitter', url: 'https://x.com/exameets', logo: FaTwitter },
//     { name: 'LinkedIn', url: 'https://www.linkedin.com/company/exameets/', logo: FaLinkedin },
//     { name: 'Instagram', url: 'https://www.instagram.com/exameets/', logo: FaInstagram },
//     { name: 'Telegram', url: 'https://t.me/exameetschannel', logo: FaTelegram },
//     { name: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41', logo: FaWhatsapp }
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl dark:shadow-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-900 dark:text-white">Join Our Community!</h2>
//           <button
//             name="close"
//             aria-label="Close"
//             onClick={() => setIsOpen(false)}
//             className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//           >
//             <X className="w-6 h-6 text-black dark:text-white" />
//           </button>
//         </div>

//         <p className="text-gray-600 dark:text-gray-300 mb-6">
//           Stay updated with our latest news and updates by following us on social media!
//         </p>

//         <div className="space-y-4">
//           {socialLinks.map((social) => (
//             <a
//               key={social.name}
//               href={social.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block w-full text-center py-2 px-4 rounded bg-[#015990] text-white hover:bg-[#01467c] transition-colors"
//             >
//               <div className="flex items-center justify-center">
//                 <social.logo size={24} />
//                 <span className="ml-2">Subscribe on {social.name}</span>
//               </div>
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialModal;






// import { useState, useEffect } from 'react';
// import { X, Users, Bell, Heart, Twitter, Linkedin, Instagram, Send } from 'lucide-react';
// import { FaWhatsapp } from "react-icons/fa6";


// const socialLinks = [
//   { 
//     name: 'Twitter', 
//     url: 'https://x.com/exameets', 
//     Icon: Twitter,
//     color: 'from-blue-400 to-blue-600',
//     description: 'Latest updates & news'
//   },
//   { 
//     name: 'LinkedIn', 
//     url: 'https://www.linkedin.com/company/exameets/', 
//     Icon: Linkedin,
//     color: 'from-blue-600 to-blue-800',
//     description: 'Professional insights'
//   },
//   { 
//     name: 'Instagram', 
//     url: 'https://www.instagram.com/exameets/', 
//     Icon: Instagram,
//     color: 'from-pink-400 to-purple-600',
//     description: 'Behind the scenes'
//   },
//   { 
//     name: 'Telegram', 
//     url: 'https://t.me/exameetschannel', 
//     Icon: Send,
//     color: 'from-blue-400 to-cyan-500',
//     description: 'Instant notifications'
//   },
//   { 
//     name: 'WhatsApp', 
//     url: 'https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41', 
//     Icon: FaWhatsapp,
//     color: 'from-green-400 to-green-600',
//     description: 'Direct updates'
//   }
// ];

// const SocialModal = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   useEffect(() => {
//     const hasModalBeenShown = document.cookie.includes('socialModalShown=true');

//     if (!hasModalBeenShown) {
//       setTimeout(() => {
//         setIsOpen(true);
//         setIsAnimating(true);
//       }, 500); // Small delay for better UX
      
//       // Set cookie to expire in 3 months
//       const expiryDate = new Date();
//       expiryDate.setMonth(expiryDate.getMonth() + 3);
//       document.cookie = `socialModalShown=true; expires=${expiryDate.toUTCString()}; path=/`;
//     }
//   }, []);

//   const handleClose = () => {
//     setIsAnimating(false);
//     setTimeout(() => setIsOpen(false), 300);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
//       <div className={`bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
//         {/* Header with gradient background */}
//         <div className="bg-gradient-to-r from-[#015990] to-[#01467c] rounded-t-2xl p-6 text-white relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
          
//           <div className="flex justify-between items-start relative z-10">
//             <div>
//               <div className="flex items-center mb-2">
//                 <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <h2 className="text-2xl font-bold">Join Our Community!</h2>
//               </div>
//               <p className="text-blue-100 text-sm">
//                 Connect with thousands of learners and stay updated with the latest educational content
//               </p>
//             </div>
            
//             <button
//               name="close"
//               aria-label="Close"
//               onClick={handleClose}
//               className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="flex items-center justify-center mb-6">
//             <div className="flex items-center text-gray-600 dark:text-gray-400">
//               <Bell className="w-4 h-4 mr-2" />
//               <span className="text-sm">Never miss an update</span>
//               <Heart className="w-4 h-4 ml-2 text-red-500" />
//             </div>
//           </div>

//           <div className="space-y-3">
//             {socialLinks.map((social, index) => (
//               <a
//                 key={social.name}
//                 href={social.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="group block w-full p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-[#015990] hover:to-[#01467c] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center group-hover:bg-white group-hover:bg-opacity-20 transition-colors">
//                       <social.Icon className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-white" />
//                     </div>
//                   </div>
                  
//                   <div className="ml-4 flex-1">
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
//                         Follow on {social.name}
//                       </h3>
//                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                         </svg>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-100 transition-colors">
//                       {social.description}
//                     </p>
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>

//           {/* Footer */}
//           <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <div className="text-center">
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 Join 10,000+ students already learning with us
//               </p>
//               <button
//                 onClick={handleClose}
//                 className="mt-3 text-sm text-[#015990] hover:text-[#01467c] font-medium transition-colors"
//               >
//                 Maybe later
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialModal;

import { useState, useEffect } from 'react';
import { X, Users, Bell, Heart, Twitter, Linkedin, Instagram, Send  } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa6";


const socialLinks = [
  { 
    name: 'Twitter', 
    url: 'https://x.com/exameets', 
    Icon: Twitter,
    color: 'from-blue-400 to-blue-600',
    description: 'Latest updates & news'
  },
  { 
    name: 'LinkedIn', 
    url: 'https://www.linkedin.com/company/exameets/', 
    Icon: Linkedin,
    color: 'from-blue-600 to-blue-800',
    description: 'Professional insights'
  },
  { 
    name: 'Instagram', 
    url: 'https://www.instagram.com/exameets/', 
    Icon: Instagram,
    color: 'from-pink-400 to-purple-600',
    description: 'Behind the scenes'
  },
  { 
    name: 'Telegram', 
    url: 'https://t.me/exameetschannel', 
    Icon: Send,
    color: 'from-blue-400 to-cyan-500',
    description: 'Instant notifications'
  },
  { 
    name: 'WhatsApp', 
    url: 'https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41', 
    Icon: FaWhatsapp,
    color: 'from-green-400 to-green-600',
    description: 'Direct updates'
  }
];

const SocialModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const hasModalBeenShown = document.cookie.includes('socialModalShown=true');

    if (!hasModalBeenShown) {
      setTimeout(() => {
        setIsOpen(true);
        setIsAnimating(true);
      }, 500); // Small delay for better UX
      
      // Set cookie to expire in 3 months
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 3);
      document.cookie = `socialModalShown=true; expires=${expiryDate.toUTCString()}; path=/`;
    }
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4 overflow-y-auto ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full shadow-2xl transform transition-all duration-300 my-auto ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#015990] to-[#01467c] rounded-t-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full -ml-8 -mb-8"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center mb-1">
                <div className="bg-white bg-opacity-20 p-1.5 rounded-full mr-2">
                  <Users className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold">Join Our Community!</h2>
              </div>
              <p className="text-blue-100 text-xs">
                Connect with thousands of learners
              </p>
            </div>
            
            <button
              name="close"
              aria-label="Close"
              onClick={handleClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Bell className="w-3 h-3 mr-1" />
              <span className="text-xs">Never miss an update</span>
              <Heart className="w-3 h-3 ml-1 text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            {socialLinks.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-[#015990] hover:to-[#01467c] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-600 flex items-center justify-center group-hover:bg-white group-hover:bg-opacity-20 transition-colors">
                      <social.Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-white" />
                    </div>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-white transition-colors">
                        Follow on {social.name}
                      </h3>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-100 transition-colors">
                      {social.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Join 10,000+ students already learning with us
              </p>
              <button
                onClick={handleClose}
                className="mt-2 text-xs text-[#015990] hover:text-[#01467c] font-medium transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;