import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { config } from '../../config/store.config';
import { X, Zap, ArrowUpRight } from 'lucide-react';

export const AnnouncementBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftCableRef = useRef<HTMLDivElement>(null);
  const rightCableRef = useRef<HTMLDivElement>(null);
  
  const [isVisible, setIsVisible] = useState(true);

  const isEnabled = config.announcement?.enabled && config.announcement.text && isVisible;

  useEffect(() => {
    if (!isEnabled) return;

    const tl = gsap.timeline();

    // 1. Cables drop down
    tl.fromTo([leftCableRef.current, rightCableRef.current], 
      { height: 0 },
      { height: 64, duration: 0.5, ease: "power2.out", stagger: 0.1 }
    );

    // 2. Card drops and swings (Hinge Effect)
    tl.fromTo(cardRef.current,
      { y: -300, rotation: -5, opacity: 0 },
      { y: 0, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
      "-=0.2"
    );

  }, [isEnabled]);

  const handleClose = () => {
      // Retract animation
      const tl = gsap.timeline({ onComplete: () => setIsVisible(false) });
      
      tl.to(cardRef.current, { y: -20, opacity: 0, duration: 0.3 })
        .to([leftCableRef.current, rightCableRef.current], { height: 0, duration: 0.3 }, "-=0.2");
  };

  if (!isEnabled) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 right-4 md:right-10 z-[100] flex flex-col items-center pointer-events-none"
    >
       {/* The "Cables" holding the sign */}
       <div className="flex gap-24 md:gap-32 w-full justify-center -mb-2 relative z-0">
           <div ref={leftCableRef} className="w-0.5 bg-white/20 h-0 shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
           <div ref={rightCableRef} className="w-0.5 bg-white/20 h-0 shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
       </div>

       {/* The "Signboard" Card */}
       <div 
         ref={cardRef}
         className="pointer-events-auto relative w-[85vw] max-w-[320px] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] group"
       >
          {/* Neon Top Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-white to-primary opacity-80 shadow-[0_0_20px_rgba(var(--color-primary),0.8)]" />
          
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
          />

          {/* Header */}
          <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-2">
                <div className="p-1 bg-primary/20 rounded text-primary animate-pulse">
                    <Zap className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/60">Incoming</span>
             </div>
             
             <button 
               onClick={handleClose}
               className="text-white/20 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
             >
                <X className="w-4 h-4" />
             </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
             <p className="text-sm font-bold text-white leading-relaxed tracking-wide">
                {config.announcement?.text}
             </p>
          </div>

          {/* Action Footer */}
          {config.announcement?.link && (
             <a 
               href={config.announcement.link}
               target="_blank"
               rel="noopener noreferrer"
               className="block bg-white/5 hover:bg-primary hover:text-white transition-all duration-300 px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between group/link border-t border-white/5"
             >
                <span>Check Details</span>
                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
             </a>
          )}
       </div>
    </div>
  );
};

