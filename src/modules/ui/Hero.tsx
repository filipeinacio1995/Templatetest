import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { config } from '../../config/store.config';

// Simple debounce utility - limits function calls to once per wait period
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) return; // Skip if debounce is active
    fn(...args);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, wait);
  };
}

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Memoized mouse move handler with debounce for performance
  const handleMouseMove = useCallback(
    debounce((e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate normalized position (-0.5 to 0.5)
      const xPct = clientX / innerWidth - 0.5;
      const yPct = clientY / innerHeight - 0.5;

      gsap.to(containerRef.current, {
        x: xPct * 40,
        y: yPct * 40,
        rotationY: xPct * 10,
        rotationX: -yPct * 10,
        duration: 1,
        ease: "power2.out"
      });
    }, 16), // ~60fps throttle
    []
  );

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // 1. Initial State (Hidden, Skewed, Blurred)
    gsap.set([titleRef.current, textRef.current], {
      y: 100,
      opacity: 0,
      skewY: 7,
      filter: "blur(10px)"
    });

    // 2. Entrance Animation (Staggered Reveal)
    tl.to([titleRef.current, textRef.current], {
      y: 0,
      opacity: 1,
      skewY: 0,
      filter: "blur(0px)",
      duration: 1.8,
      stagger: 0.15,
      delay: 0.2
    });

    // 3. Mouse Parallax / Tilt Effect
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <section 
        className="relative min-h-[35vh] w-full flex items-center justify-center pointer-events-none pb-24"
        style={{ perspective: "1000px" }}
    >
      {/* Content Container */}
      <div 
        ref={containerRef} 
        className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 will-change-transform"
      >
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl uppercase italic will-change-transform"
        >
          {config.content.heroTitle}
        </h1>
        <p 
          ref={textRef}
          className="text-lg md:text-2xl text-white/80 font-medium max-w-2xl mx-auto drop-shadow-lg will-change-transform"
        >
          {config.content.heroSubtitle}
        </p>
      </div>
    </section>
  );
};
