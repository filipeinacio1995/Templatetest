import { useEffect, useState } from 'react';
import { Button } from './Button';

export const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
    // Reload to trigger Analytics (or simpler: dispatch event)
    window.location.reload(); 
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-sm p-6 bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in">
      <h3 className="text-lg font-bold text-white mb-2">🍪 Cookies & Privacy</h3>
      <p className="text-sm text-text-muted mb-6 leading-relaxed">
        We use cookies to analyze traffic and improve your experience. 
        Is that okay with you?
      </p>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDecline}
          className="flex-1"
        >
          Decline
        </Button>
        <Button 
          size="sm" 
          onClick={handleAccept}
          className="flex-1 bg-white text-black hover:bg-white/90"
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
