import { useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { clsx } from 'clsx';
import { config } from '../../config/store.config';
import { useCartStore } from '../store/cart.store';
import { Button } from './Button';
import type { BasketPackage } from '../../shared/types/tebex';
import { getInBasketQuantity } from '../../shared/utils/type-guards';

export const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const { basket, toggleCart } = useCartStore();

  // Calculate item count using type-safe utility
  const itemCount = basket?.packages.reduce((acc: number, item: BasketPackage) => {
      return acc + getInBasketQuantity(item);
  }, 0) || 0;

  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.5 }
    );
  }, []);

  // Pulse animation when itemCount changes
  useEffect(() => {
      if (itemCount > 0 && badgeRef.current) {
          gsap.fromTo(badgeRef.current,
              { scale: 1.5, boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" }, // intense glow
              { scale: 1, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.5)", duration: 0.4, ease: "back.out(1.7)" }
          );
      }
  }, [itemCount]);

  return (
    <nav className={clsx(
        "fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 top-6"
    )}>
      <div 
        ref={navRef}
        className="pointer-events-auto mx-4 w-full max-w-6xl bg-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.3)] -skew-x-6 px-8 py-3 flex items-center justify-between"
      >
        {/* Logo Area - Counter Skew */}
        <div className="flex items-center gap-4 skew-x-6">
          {config.theme.images.logo ? (
             <Link to="/">
                 <img 
                   src={config.theme.images.logo} 
                   alt={config.storeName} 
                   width="120"
                   height="32"
                   className="h-8 w-auto object-contain"
                 />
             </Link>
          ) : (
             <Link to="/" className="font-black text-2xl uppercase italic tracking-tighter text-white drop-shadow-md">
                {config.storeName}
             </Link>
          )}
        </div>

        {/* Navigation - Counter Skew */}
        <div className="hidden md:flex items-center gap-8 skew-x-6">
            {config.navigation.map((nav) => (
                nav.external ? (
                    <a 
                        key={nav.label}
                        href={nav.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative text-sm font-bold uppercase italic tracking-widest text-white/60 hover:text-white transition-colors duration-300 group"
                    >
                        {nav.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
                    </a>
                ) : (
                    <Link 
                        key={nav.label}
                        to={nav.url}
                        className="relative text-sm font-bold uppercase italic tracking-widest text-white/60 hover:text-white transition-colors duration-300 group"
                    >
                        {nav.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300 ease-out" />
                    </Link>
                )
            ))}
        </div>

        {/* Actions - Counter Skew */}
        <div className="flex items-center gap-3 skew-x-6">
            <Button 
              onClick={toggleCart} 
              variant="ghost" 
              aria-label="View Basket"
              className="relative bg-white/5 hover:bg-primary hover:text-white text-white border border-white/10 hover:border-primary transition-all duration-300 group skew-x-0 rounded-none"
            >
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline text-sm font-bold uppercase italic tracking-wider">Basket</span>
                </div>
                {itemCount > 0 && (
                    <span 
                        ref={badgeRef}
                        className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center shadow-lg shadow-black/50 border border-black/20"
                    >
                        {itemCount}
                    </span>
                )}
            </Button>
        </div>
      </div>
    </nav>
  );
};
