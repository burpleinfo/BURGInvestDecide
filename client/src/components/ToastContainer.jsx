import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const ToastItem = ({ id, message, type = 'success', duration = 3000, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onRemove(id);
      }, 300); // Match exit animation duration
    }, duration);

    return () => clearTimeout(timeout);
  }, [id, duration, onRemove]);

  const typeConfig = {
    success: {
      bg: 'bg-green-500',
      icon: <Check className="h-5 w-5 shrink-0" />
    },
    error: {
      bg: 'bg-red-500',
      icon: <X className="h-5 w-5 shrink-0" />
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: <AlertCircle className="h-5 w-5 shrink-0" />
    },
    info: {
      bg: 'bg-blue-500',
      icon: <Info className="h-5 w-5 shrink-0" />
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 rounded-xl text-white shadow-lg font-medium transition-all duration-300 min-w-80 backdrop-blur-sm border border-white/20 ${config.bg} ${
        isExiting ? 'translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      {config.icon}
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            onRemove(id);
          }, 300);
        }}
        className="ml-2 hover:opacity-75 transition-opacity shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onRemove={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
