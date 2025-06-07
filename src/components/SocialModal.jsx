// components/SocialModal.js
import { useState, useEffect } from 'react';
import { FaWhatsapp,FaInstagram, FaTwitter, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { X } from 'lucide-react';

const SocialModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the modal has been shown before
    const hasModalBeenShown = document.cookie.includes('socialModalShown=true');
    
    if (!hasModalBeenShown) {
      setIsOpen(true);
      // Set cookie to expire in 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `socialModalShown=true; expires=${expiryDate.toUTCString()}; path=/`;
    }
  }, []);

  if (!isOpen) return null;

  const socialLinks = [
    { name: 'Twitter', url: 'https://x.com/exameets' , logo: FaTwitter },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/exameets/' , logo: FaLinkedin },
    { name: 'Instagram', url: 'https://www.instagram.com/exameets/' , logo: FaInstagram },
    { name: 'Telegram', url: 'https://t.me/exameetschannel' , logo: FaTelegram },
    { name: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VaksJ72Lo4hmldL0yl41' , logo: FaWhatsapp }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Join Our Community!</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Stay updated with our latest news and updates by following us on social media!
        </p>
        
        <div className="space-y-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 px-4 rounded bg-[#015990] text-white hover:bg-[#01467c] transition-colors"
            >
                <div className="flex items-center justify-center">
                    <social.logo size={24}/>
                    <span className="ml-2">Subscribe on {social.name}</span>
                </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialModal;