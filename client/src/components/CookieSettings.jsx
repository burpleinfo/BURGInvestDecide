import React, { useState } from 'react';
import { getCookie, saveCookieConsent } from '../utils/cookieUtils';
import { X } from 'lucide-react';

const CookieSettings = ({ onClose }) => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: getCookie('cookieConsent') === 'true',
    marketing: getCookie('cookieConsent') === 'true',
  });

  const handleToggle = (category) => {
    if (category !== 'essential') {
      setPreferences(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }
  };

  const handleSave = () => {
    const allowed = preferences.analytics || preferences.marketing;
    saveCookieConsent(allowed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-gray-900">Cookie Preferences</h2>
        <p className="mb-6 text-sm text-gray-600">
          Manage your cookie preferences. Essential cookies are always enabled.
        </p>

        {/* Cookie Categories */}
        <div className="space-y-4 mb-6">
          {/* Essential Cookies */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Required for website functionality and security.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.essential}
                disabled
                className="h-5 w-5 rounded border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Help us understand how you use our website.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handleToggle('analytics')}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Used for personalized content and advertising.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => handleToggle('marketing')}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-yellow-400 px-4 py-2.5 font-semibold text-gray-900 transition hover:bg-yellow-500"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;
