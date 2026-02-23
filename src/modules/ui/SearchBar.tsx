import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Handle expand/collapse animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isExpanded || value.length > 0) {
        // Expand Sequence
        const tl = gsap.timeline();
        
        tl.to(containerRef.current, {
          width: 350,
          paddingLeft: 0, // Input has padding, container doesn't need it if input is absolute/full
          paddingRight: 0,
          duration: 0.4,
          ease: "back.out(1.2)" // Slight overshoot for organic feel
        })
        .to(inputRef.current, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out"
        }, "-=0.3");

      } else {
        // Collapse Sequence
        const tl = gsap.timeline();

        tl.to(inputRef.current, {
          opacity: 0,
          duration: 0.1
        })
        .to(containerRef.current, {
          width: 60, // Match h-14ish
          paddingLeft: 0,
          paddingRight: 0,
          duration: 0.4,
          ease: "power3.inOut"
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isExpanded, value]);

  // ... keyboard handlers ...

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
       
      {/* The Tech Bar */}
      <div 
        ref={containerRef}
        style={{ width: 60 }} // Force initial collapsed width to prevent layout jump
        onClick={() => {
            if (!isExpanded) {
                setIsExpanded(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }
        }}
        className={`
            h-14 bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]
            flex items-center justify-center overflow-hidden transition-all duration-300 -skew-x-12
            ${isExpanded 
                ? 'border-primary/50 cursor-text shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                : 'hover:bg-white/10 hover:border-white/40 cursor-pointer hover:scale-105'
            }
        `}
      >
        <div className="relative flex items-center w-full h-full skew-x-12">
            {/* Icon */}
            <div ref={iconRef} className={`absolute left-0 flex items-center justify-center w-14 h-14 pointer-events-none ${isExpanded ? 'text-primary' : 'text-white'}`}>
                <Search className="w-6 h-6" />
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => {
                  if (value === '') setIsExpanded(false);
              }}
              className={`
                  w-full bg-transparent border-none text-white placeholder:text-white/30 focus:outline-none text-lg font-bold uppercase italic tracking-wider
                  pl-14 pr-10 h-full
                  ${isExpanded || value.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none w-0'}
                  transition-opacity duration-300
              `}
              placeholder="SEARCH COMMAND..."
            />

            {/* Close/Clear Button */}
            {(value.length > 0) && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange('');
                        inputRef.current?.focus();
                    }}
                    className="absolute right-0 mr-2 p-1 hover:bg-white/20 text-white/50 hover:text-red-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
      
      {/* Helper Text */}
      <div className={`mt-3 text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 transition-opacity duration-300 font-mono ${isExpanded ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
        [CTRL + K] TO SEARCH
      </div>
    </div>
  );
};