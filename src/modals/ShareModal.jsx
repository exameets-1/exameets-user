import React, { useState } from "react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaTimes, FaCheck } from "react-icons/fa";

const getShareUrl = (platform, url, title, details) => {
  const text = encodeURIComponent(`${title}\n${details}\n${url}`);
  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${text}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(title + "\n" + details)}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title + "\n" + details)}`;
    case "instagram":
      return "https://www.instagram.com/";
    default:
      return "#";
  }
};

export default function ShareModal({ open, onClose, url, title, details }) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialPlatforms = [
    { name: "WhatsApp", platform: "whatsapp", icon: FaWhatsapp, color: "text-green-500" },
    { name: "Facebook", platform: "facebook", icon: FaFacebook, color: "text-blue-600" },
    { name: "Twitter", platform: "twitter", icon: FaTwitter, color: "text-sky-500" },
    { name: "Instagram", platform: "instagram", icon: FaInstagram, color: "text-pink-500" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Share
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

{/* Social Media Options */}
<div className="px-6 pb-6">
  <div className="grid grid-cols-2 sm:flex sm:justify-center sm:flex-wrap gap-6">
    {socialPlatforms.map(({ name, platform, icon: Icon, color }) => (
      <a
        key={platform}
        href={getShareUrl(platform, url, title, details)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className={`${color} text-3xl`}>
          <Icon />
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {name}
        </span>
      </a>
    ))}
  </div>
</div>


        {/* Copy Link Section */}
        <div className="px-6 pb-6">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Tap to Copy link
            </p>
            <div
              onClick={handleCopyLink}
              className={`cursor-pointer flex-1 min-w-0 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 ${
                copied
                  ? "ring-2 ring-green-400 dark:ring-green-500"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {copied ? "Copied!" : url}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
