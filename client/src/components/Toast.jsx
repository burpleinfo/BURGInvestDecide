import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 2000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 300); // Match animation duration
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-lg text-white shadow-lg font-medium transition-all duration-300 ${bgColor} ${
        isExiting ? 'translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
