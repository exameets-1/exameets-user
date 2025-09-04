import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const CookieConsent = () => {
  const [cookies, setCookie] = useCookies(["userConsent"]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show the banner only if consent is not already given
    if (!cookies.userConsent) {
      setShowBanner(true);
    } else if (cookies.userConsent === "accepted") {
      // Initialize GA if already accepted
      initializeGoogleAnalytics();
    }
  }, [cookies]);

  const initializeGoogleAnalytics = () => {
    // Prevent multiple script injections
    if (document.getElementById("ga-script")) return;

    const script = document.createElement("script");
    script.id = "ga-script";
    script.src = "https://www.googletagmanager.com/gtag/js?id="; //Add your GA ID here
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "//Add your GA ID here", { anonymize_ip: true });
    };
  };

  const handleAccept = () => {
    // Save "accepted" in cookies
    setCookie("userConsent", "accepted", { path: "/", maxAge: 31536000 }); // 1 year
    setShowBanner(false);

    // Initialize GA
    initializeGoogleAnalytics();
  };

  const handleDecline = () => {
    // Save "declined" in cookies
    setCookie("userConsent", "declined", { path: "/", maxAge: 31536000 }); // 1 year
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <p className="text-sm text-center sm:text-left">
          We use cookies to improve your experience. By clicking{" "}
          <span className="font-semibold">&quot;Allow&ldquo;</span>, you agree to our use
          of cookies for analytics. Read our{" "}
          <a
            href="/cookie-policy"
            className="underline text-blue-400 hover:text-blue-300"
          >
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleAccept}
            className="bg-[#015990] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Allow
          </button>
          <button
            onClick={handleDecline}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
