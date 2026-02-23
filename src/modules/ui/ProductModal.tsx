import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ShoppingCart, Loader2, Plus, Tag, Package } from 'lucide-react';
import gsap from 'gsap';
import type { TebexPackage } from '../../shared/types/tebex';
import { Button } from './Button';
import { useCartStore } from '../store/cart.store';
import { SEO } from './SEO';
import { clsx } from 'clsx';
import { formatPrice } from '../../shared/utils/price';
import { findPackageInBasket, getInBasketQuantity, getPackagePrice, getCategoryName } from '../../shared/utils/type-guards';

interface ProductModalProps {
  pkg: TebexPackage;
  onClose: () => void;
}

export const ProductModal = ({ pkg, onClose }: ProductModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addItem, basket } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  // Check if item is in cart using type guards
  const inCartItem = findPackageInBasket(basket?.packages, pkg.id);
  const quantityInCart = getInBasketQuantity(inCartItem);
  const categoryName = getCategoryName(pkg);

  useEffect(() => {
    // Open Animation
    const tl = gsap.timeline();
    tl.to(backdropRef.current, { opacity: 1, duration: 0.3 })
      .fromTo(modalRef.current, 
        { scale: 0.9, opacity: 0, y: 50, rotationX: 10 },
        { scale: 1, opacity: 1, y: 0, rotationX: 0, duration: 0.5, ease: "power4.out" },
        "-=0.1"
      )
      .fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
      );

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { scale: 0.95, opacity: 0, y: 30, duration: 0.3, ease: "power2.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
  };

  const handleAdd = useCallback(async () => {
    setIsAdding(true);
    try {
      await addItem(pkg.id);
    } finally {
      setIsAdding(false);
    }
  }, [addItem, pkg.id]);

  // Strip HTML tags from description for meta description
  const plainDescription = pkg.description.replace(/<[^>]+>/g, '').slice(0, 160);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <SEO 
        title={pkg.name} 
        description={plainDescription}
        image={pkg.image || undefined}
      />
      
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 cursor-pointer"
      />
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl bg-[#0f0f0f] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:h-[600px] opacity-0 group"
      >
         {/* Tech Accents */}
         <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-xl pointer-events-none z-20" />
         <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-xl pointer-events-none z-20" />

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all border border-transparent hover:border-white/20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* LEFT SIDE: Visuals */}
        <div className="w-full md:w-5/12 relative bg-black/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
           {pkg.image ? (
             <>
                {/* Background: Blurred & Zoomed to fill space */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={pkg.image} 
                        alt="" 
                        className="w-full h-full object-cover opacity-50 blur-2xl scale-125 grayscale-[0.5]" 
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                
                {/* Foreground: The actual 16:9 image, fully visible */}
                <div className="relative z-10 w-full aspect-video p-4">
                    <img 
                        src={pkg.image} 
                        alt={pkg.name} 
                        className="w-full h-full object-contain shadow-2xl rounded border border-white/10 bg-black/50" 
                    />
                </div>
             </>
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/50 border-r border-white/5">
                <Package className="w-24 h-24 text-white/5 mb-4" />
                <span className="text-white/20 font-mono text-xs uppercase tracking-widest">No Preview</span>
             </div>
           )}
           
           {/* Category Tag Overlay */}
           <div className="absolute top-6 left-6 z-20 flex flex-col items-start gap-2">
              {categoryName && (
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-xs font-bold uppercase tracking-wider rounded shadow-lg">
                   <Tag className="w-3 h-3 inline-block mr-1.5 mb-0.5" />
                   {categoryName}
                </span>
              )}
           </div>
        </div>

        {/* RIGHT SIDE: Content */}
        <div className="w-full md:w-7/12 flex flex-col relative bg-[#0f0f0f]">
           
           {/* Header Section */}
           <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-2 leading-none">
                {pkg.name}
              </h2>
              <div className="flex items-center gap-4 text-primary font-mono">
                 <span className="text-2xl font-bold">
                   {formatPrice(getPackagePrice(pkg))}
                 </span>
                 {quantityInCart > 0 && (
                    <span className="text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" /> In Cart: {quantityInCart}
                    </span>
                 )}
              </div>
           </div>

           {/* Scrollable Description */}
           <div 
             ref={contentRef}
             className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0f0f0f]"
           >
              <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed">
                 <div dangerouslySetInnerHTML={{ __html: pkg.description }} />
              </div>
           </div>

           {/* Sticky Footer Action Area */}
           <div className="p-6 border-t border-white/5 bg-[#0a0a0a] flex items-center gap-4 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <div className="hidden md:flex flex-col justify-center">
                 <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Total</span>
                 <span className="text-xl font-bold text-white">{formatPrice(getPackagePrice(pkg))}</span>
              </div>
              
              <Button 
                onClick={handleAdd} 
                size="lg" 
                disabled={isAdding}
                className={clsx(
                  "flex-1 h-14 text-lg font-black uppercase italic tracking-wider transition-all duration-300 rounded shadow-lg relative overflow-hidden",
                  quantityInCart > 0 
                    ? "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white" 
                    : "bg-white text-black hover:bg-primary hover:text-white border-2 border-transparent"
                )}
              >
                 {/* Button Shine Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shine" />
                 
                 {isAdding ? (
                   <div className="flex items-center justify-center gap-2">
                     <Loader2 className="w-5 h-5 animate-spin" />
                     Processing...
                   </div>
                 ) : (
                   <div className="flex items-center justify-center gap-2">
                     {quantityInCart > 0 ? (
                         <>
                            <Plus className="w-5 h-5" /> Add Another
                         </>
                     ) : (
                         <>
                            Add to Basket <ShoppingCart className="w-5 h-5" />
                         </>
                     )}
                   </div>
                 )}
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
};
