import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { config } from '../../config/store.config';

gsap.registerPlugin(ScrollTrigger);

export const StorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config.story?.enabled || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.story-slide');
      
      // 1. Set Z-Index Stacking
      gsap.set(slides, { zIndex: (i) => slides.length - i });

      // 2. Prepare Titles
      const secondSlideTitle = slides[1]?.querySelector('h2');
      if (secondSlideTitle) {
          gsap.set(secondSlideTitle, { opacity: 0, scale: 0.8, filter: "blur(10px)" });
      }
      
      const lastSlideIndex = slides.length - 1;
      const lastSlideTitle = slides[lastSlideIndex]?.querySelector('h2');
      const lastSlideOverlay = slides[lastSlideIndex]?.querySelector('.std-overlay'); // Target the dark overlay

      if (lastSlideTitle) {
           gsap.set(lastSlideTitle, { opacity: 0, scale: 1.2, filter: "blur(5px)" });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: "+=" + (slides.length * 300) + "%", 
          pin: true,
          scrub: 1, 
          anticipatePin: 1,
        }
      });

      slides.forEach((slide, i) => {
        if (i === slides.length - 1) return; 

        const description = slide.querySelector('.story-desc');

        // === SLIDE 0: PORTAL ZOOM ===
        if (i === 0) {
            const maskText = slide.querySelector('.mask-text');
            const overlayText = slide.querySelector('.overlay-text');
            const wallImage = slide.querySelector('.wall-image'); 
            const overlayLayer = slide.querySelector('.overlay-layer');
            
            const nextSlide = slides[i+1];
            const nextTitle = nextSlide?.querySelector('h2');

            tl.to(description, { opacity: 0, duration: 0.5 });
            tl.to(overlayText, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, "<");

            tl.to([maskText, overlayText], {
                scale: 30, // Reduced from 100 for better GPU performance
                transformOrigin: "50% 50%",
                duration: 6, // Slightly faster for snappier feel
                ease: "power2.in"
            }, "<"); 

            tl.to(wallImage, {
                scale: 2.5,
                transformOrigin: "50% 50%",
                duration: 6,
                ease: "power2.in"
            }, "<");
            
            tl.to(overlayLayer, { opacity: 0, duration: 1.0, ease: "power1.out" }, ">-1.5"); 

            if (nextTitle) {
                tl.to(nextTitle, {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 2, 
                    ease: "power2.out"
                }, ">-1.5"); 
            }
            
            tl.to({}, { duration: 2 }); 

        } else {
            // === SLIDE 1+: WARP & SHATTER ===
            const slideImage = slide.querySelector('img');
            const slideTitle = slide.querySelector('h2');
            const isNextLast = (i + 1) === lastSlideIndex;

            tl.to(description, { opacity: 0, duration: 0.5 }, "+=0.5");

            tl.to(slideImage, {
                scale: 1.5, // Reduced from 1.8
                xPercent: i % 2 === 0 ? 60 : -60, // Reduced from 80
                filter: "blur(8px) brightness(1.3)", // Reduced blur from 15px
                opacity: 0,
                duration: 2.5,
                ease: "power2.in"
            }, "<"); 

            tl.to(slideTitle, {
                scale: 4, // Reduced from 8
                rotation: i % 2 === 0 ? 15 : -15, // Reduced from 25
                opacity: 0,
                duration: 2,
                ease: "expo.in"
            }, "<");
            
            // === REVEAL LAST SLIDE ===
            if (isNextLast) {
                // 1. Animate Title In
                if (lastSlideTitle) {
                    tl.to(lastSlideTitle, {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 2,
                        ease: "power2.out"
                    }, ">-1.5");
                }
                // 2. Animate Dark Overlay OUT (Brighten the image)
                // We reduce opacity from 0.4 to 0.0 (or 0.1 for readability)
                if (lastSlideOverlay) {
                    tl.to(lastSlideOverlay, {
                        opacity: 0.1, // Keep slight tint for text readability, or 0 for full bright
                        duration: 2,
                        ease: "power1.out"
                    }, "<");
                }
            }
        }
      });

      tl.to({}, { duration: 5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!config.story?.enabled) return null;

  return (
    <section 
        ref={containerRef} 
        className="relative w-full h-screen bg-black overflow-hidden"
    >
      
      {config.story.items.map((item, index) => (
        <div
            key={index}
            className="story-slide absolute inset-0 w-full h-full overflow-hidden"
        >
            {index === 0 ? (
                /* === SLIDE 0: ZOOM MASK === */
                <div className="overlay-layer w-full h-full absolute inset-0 z-10">
                     <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <mask id={`mask-${index}`}>
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                <text 
                                    className="mask-text font-black italic uppercase tracking-tighter"
                                    x="960" y="540"
                                    textAnchor="middle" dominantBaseline="middle" 
                                    fill="black" fontSize="160" 
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {item.title}
                                </text>
                            </mask>
                        </defs>
                        
                        <image 
                            className="wall-image"
                            href={item.image} width="1920" height="1080"
                            preserveAspectRatio="xMidYMid slice"
                            mask={`url(#mask-${index})`}
                        />
                        {/* Dimmer for Slide 0 */}
                        <rect className="wall-dimmer" width="100%" height="100%" fill="black" opacity="0.4" mask={`url(#mask-${index})`} />

                        <text 
                            className="overlay-text font-black italic uppercase tracking-tighter"
                            x="960" y="540"
                            textAnchor="middle" dominantBaseline="middle" 
                            fill="white" fontSize="160" 
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {item.title}
                        </text>
                     </svg>
                </div>
            ) : (
                /* === SLIDE 1+: STANDARD LAYOUT === */
                <div className="w-full h-full absolute inset-0 z-0">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                    />
                    {/* CHANGED: Use a class 'std-overlay' and reduced opacity from 60 to 40 initially */}
                    <div className="std-overlay absolute inset-0 bg-black/40" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter text-white text-center drop-shadow-2xl opacity-100">
                            {item.title}
                        </h2>
                    </div>
                </div>
            )}

            <div className="story-desc absolute bottom-24 left-0 w-full text-center px-4 pointer-events-none z-20">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-white/20 text-sm font-bold uppercase tracking-[1em] mb-4">Chapter 0{index + 1}</h2>
                    <p className="text-white text-2xl font-medium drop-shadow-lg">
                        {item.description}
                    </p>
                </div>
            </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none text-white/30 text-xs uppercase tracking-widest">
         Scroll to Explore
      </div>
    </section>
  );
};