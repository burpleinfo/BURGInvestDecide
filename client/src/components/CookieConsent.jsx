import React, { useState, useEffect } from 'react';
import { getCookie, saveCookieConsent, shouldShowConsentBanner } from '../utils/cookieUtils';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user needs to see the consent banner (once per day)
    if (shouldShowConsentBanner()) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    saveCookieConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    saveCookieConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white shadow-2xl animate-slide-up">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold">
              🍪 Cookie Reminder
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              We use cookies to remember your login information, improve your experience, and provide personalized features. 
              By clicking "Accept", you consent to our use of cookies. You can manage your preferences anytime.
            </p>
          </div>
          
          <div className="flex flex-shrink-0 gap-3 md:gap-4">
            <button
              onClick={handleReject}
              className="rounded-lg border border-gray-400 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-yellow-500"
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleReject}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        aria-label="Close cookie consent"
      >
        <X className="h-5 w-5" />
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CookieConsent;
