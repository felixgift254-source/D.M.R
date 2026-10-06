import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-slate-900 text-amber-300 px-4 py-2.5 text-xs font-semibold flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <WifiOff size={16} className="text-amber-400 animate-pulse" />
        <span>You are currently offline. Showing cached data — logs will sync when connectivity returns.</span>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-[11px] font-medium transition-colors"
      >
        <RefreshCw size={12} /> Retry Connection
      </button>
    </div>
  );
};

export default OfflineBanner;
