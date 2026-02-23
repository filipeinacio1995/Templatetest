import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { config } from '../../config/store.config';

export const ImmersiveBackground = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    // Ken Burns Effect: Slowly scale up and pan slightly
    // We use a long duration to simulate a calm loading screen vibe
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    tl.fromTo(image, 
      { scale: 1.0, xPercent: 0, yPercent: 0 },
      { scale: 1.15, xPercent: -2, yPercent: -2, duration: 20, ease: "sine.inOut" }
    );

  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 bg-black">
      {/* The Background Image */}
      <img 
        ref={imageRef}
        src={config.theme.images.heroBackground} 
        alt="Background" 
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover opacity-60 will-change-transform"
      />

      {/* Vignette for focus on center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80" />
      
      {/* Noise Overlay for texture (Linear Style) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Dark Gradient from bottom to blend with content */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
};
