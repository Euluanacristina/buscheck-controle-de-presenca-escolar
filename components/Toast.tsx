
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-[slideUpToast_0.3s_ease-out] w-[90%] max-w-xs">
      <div className={`
        flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border
        ${type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-rose-500 border-rose-400 text-white'}
      `}>
        <span className="material-icons text-xl">
          {type === 'success' ? 'check_circle' : 'error'}
        </span>
        <span className="text-sm font-black uppercase tracking-tight">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
