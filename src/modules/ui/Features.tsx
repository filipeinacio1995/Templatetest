import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { config } from '../../config/store.config';
import { DynamicIcon } from './DynamicIcon';

export const Features = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!config.features.enabled) return;

    // "Einrasten" Effect:
    // Start: Invisible, slightly lower, scaled down
    // End: Visible, original position, scaled up with a "back" ease (snap)
    gsap.fromTo(cardsRef.current,
      { 
        y: 100, 
        opacity: 0,
        scale: 0.9 
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.2,     // 0.2s delay between each card
        delay: 1.2,       // Wait for Hero text to land first
        ease: "back.out(1.7)" // The "Snap"
      }
    );
  }, []);

  if (!config.features.enabled) return null;

  return (
    <section className="container mx-auto px-4 -mt-12 relative z-30 mb-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {config.features.items.map((item, index) => (
          <div 
            key={index}
            ref={(el) => { cardsRef.current[index] = el }}
            className="group relative opacity-0" // Start with opacity-0 to avoid FOUC before GSAP kicks in
          >
            {/* Skewed Background Layer */}
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-md border border-white/10 -skew-x-12 transform transition-all duration-300 group-hover:border-primary group-hover:bg-surface/80 group-hover:shadow-[5px_5px_0px_rgba(59,130,246,1)]" />
            
            {/* Content Layer (Un-skewed text for readability) */}
            <div className="relative p-6 flex flex-col items-center text-center z-10">
              
              {/* Icon Badge */}
              <div className="mb-4 p-3 bg-white text-black rounded-full transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 font-bold">
                 <DynamicIcon name={item.icon} className="w-6 h-6" />
              </div>

              <h2 className="text-white font-black text-xl uppercase italic tracking-tighter mb-1 group-hover:text-primary transition-colors">
                {item.title}
              </h2>
              <p className="text-white/60 font-medium text-xs uppercase tracking-widest">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};
