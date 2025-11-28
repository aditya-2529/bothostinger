import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-50 animate-in slide-in-from-bottom-10 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          <p>
            We use cookies to improve your experience and for security. By using BotHost, you agree to our{' '}
            <a href="/terms" className="text-violet-400 hover:underline">Terms</a> and{' '}
            <a href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white"
            >
                Decline
            </button>
            <button 
                onClick={handleAccept}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
                Accept & Continue
            </button>
        </div>
      </div>
    </div>
  );
}