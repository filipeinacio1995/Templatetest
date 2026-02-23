import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './modules/ui/Navbar';
import { AnnouncementBar } from './modules/ui/AnnouncementBar';
import { CartSidebar } from './modules/ui/CartSidebar';
import { ImmersiveBackground } from './modules/ui/ImmersiveBackground';
import { Analytics } from './modules/ui/Analytics';
import { ConsentBanner } from './modules/ui/ConsentBanner';
import { SEO } from './modules/ui/SEO';
import { ErrorBoundary } from './modules/ui/ErrorBoundary';
import { useCartStore } from './modules/store/cart.store';
import { Toaster, toast } from 'sonner';
import { StorePage } from './pages/StorePage';
import { StoryPage } from './pages/StoryPage';

function App() {
  const initializeCart = useCartStore((state) => state.initializeCart);
  const completeAuth = useCartStore((state) => state.completeAuth);
  const isAuthenticating = useCartStore((state) => state.isAuthenticating);
  const setIsAuthenticating = useCartStore((state) => state.setIsAuthenticating);
  
  const processingAuth = useRef(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Effect for Auth Handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth_callback')) {
      if (window.opener) {
        // Notify opener and close self
        window.opener.postMessage('TEBEX_AUTH_SUCCESS', window.location.origin);
        window.close();
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data === 'TEBEX_AUTH_SUCCESS') {
        if (processingAuth.current) return; // Prevent double execution
        processingAuth.current = true;
        
        setIsAuthenticating(false); // Hide overlay
        
        // Handle post-auth logic
        toast.promise(completeAuth().finally(() => {
            // Reset processing flag after a delay to allow cleanup
            setTimeout(() => { processingAuth.current = false; }, 1000);
        }), {
           loading: 'Finalizing login...',
           success: 'Login successful! Resuming...',
           error: 'Login successful, but failed to refresh cart.'
        });
      }
    };
    window.addEventListener('message', handleMessage);
    
    // Initial Cart Load
    initializeCart();

    return () => window.removeEventListener('message', handleMessage);
  }, [initializeCart, completeAuth, setIsAuthenticating]);

  // If this is the auth popup, show minimal loader and nothing else
  if (new URLSearchParams(window.location.search).get('auth_callback')) {
     return (
       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-white/50">Completing authentication...</p>
       </div>
     );
  }

  return (
    <div className="min-h-screen text-text pb-0 relative selection:bg-primary/30 selection:text-white">
      
      {/* Auth Overlay */}
      {isAuthenticating && (
         <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6 relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
               
               <div className="w-16 h-16 mx-auto border-4 border-white/10 border-t-primary rounded-full animate-spin" />
               
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Authenticating...</h3>
                  <p className="text-text-muted text-sm">
                     Please complete the login process in the popup window.
                  </p>
               </div>

               <button 
                  onClick={() => setIsAuthenticating(false)}
                  className="text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest font-bold"
               >
                  Cancel / Close
               </button>
            </div>
         </div>
      )}

      <SEO />
      <Analytics />
      <ConsentBanner />
      <ImmersiveBackground />
      <Toaster position="top-center" theme="dark" richColors />
      
      <AnnouncementBar />
      <Navbar />
      <CartSidebar />
      
      <main className="relative z-10 min-h-screen flex flex-col">
        <ErrorBoundary>
          <Routes>
              <Route path="/" element={<StorePage />} />
              <Route path="/story" element={<StoryPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;