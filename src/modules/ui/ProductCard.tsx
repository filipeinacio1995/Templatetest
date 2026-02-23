import { useState, useCallback, memo } from 'react';
import type { TebexPackage } from '../../shared/types/tebex';
import { Button } from './Button';
import { useCartStore } from '../store/cart.store';
import { formatPrice } from '../../shared/utils/price';
import { ShoppingBag, Plus, Loader2 } from 'lucide-react';
import { findPackageInBasket, getInBasketQuantity, getPackagePrice } from '../../shared/utils/type-guards';

interface ProductCardProps {
  pkg: TebexPackage;
  onViewDetails?: (pkg: TebexPackage) => void;
}

export const ProductCard = memo(({ pkg, onViewDetails }: ProductCardProps) => {
  const { addItem, basket } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  // Check if item is in cart and get quantity using type guards
  const inCartItem = findPackageInBasket(basket?.packages, pkg.id);
  const quantityInCart = getInBasketQuantity(inCartItem);

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(pkg.id);
    } finally {
      setIsAdding(false);
    }
  }, [addItem, pkg.id]);

  return (
    <div 
      onClick={() => onViewDetails?.(pkg)}
      className="group relative bg-surface/40 backdrop-blur-md border border-white/10 hover:border-primary transition-all duration-150 cursor-pointer flex flex-col h-full overflow-hidden hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[8px_8px_0px_rgba(59,130,246,0.5)]"
    >
      {/* Tech Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 group-hover:border-primary transition-colors z-30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 group-hover:border-primary transition-colors z-30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 group-hover:border-primary transition-colors z-30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 group-hover:border-primary transition-colors z-30" />

      {/* Image Area */}
      <div className="aspect-[16/10] w-full bg-black/50 relative overflow-hidden border-b border-white/5">
        {/* Scanline overlay effect on hover */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 z-10 pointer-events-none transition-opacity duration-100 mix-blend-overlay" />
        
        {pkg.image ? (
           <img 
             src={pkg.image} 
             alt={pkg.name} 
             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 ease-out filter brightness-90 group-hover:brightness-110"
           />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-primary/20 transition-colors">
             <ShoppingBag className="w-16 h-16" />
          </div>
        )}
        
        {/* Price Tag - Technical Badge */}
        <div className="absolute top-3 left-3 z-20">
           <div className="bg-black border border-white/10 px-3 py-1 text-white font-mono font-bold text-sm tracking-wider shadow-lg group-hover:bg-primary group-hover:text-black transition-colors duration-150">
              {formatPrice(getPackagePrice(pkg))}
           </div>
        </div>
        
        {/* In Cart Badge - Technical */}
        {quantityInCart > 0 && (
            <div className="absolute top-3 right-3 z-20">
                <div className="bg-primary text-white px-2 py-1 font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white animate-pulse inline-block mr-1" />
                    In Cart ({quantityInCart})
                </div>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative z-20">
        <h3 className="text-lg font-black text-white mb-2 uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors duration-200 line-clamp-1">
          {pkg.name}
        </h3>
        
        <div 
          className="text-text-muted text-xs font-medium line-clamp-3 mb-6 flex-grow leading-relaxed tracking-wide"
          dangerouslySetInnerHTML={{ __html: pkg.description }}
        />

        <Button 
          onClick={handleAdd} 
          disabled={isAdding}
          className={`w-full mt-auto gap-2 rounded-none uppercase font-bold tracking-wider transition-all duration-200 shadow-none
            ${quantityInCart > 0 
                ? 'bg-white/5 border-2 border-primary text-primary hover:bg-primary hover:text-white' 
                : 'bg-white text-black hover:bg-primary hover:text-white border-2 border-transparent'
            }`}
        >
           {isAdding ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin" /> Adding...
             </>
           ) : (
             <>
               <Plus className="w-4 h-4" /> {quantityInCart > 0 ? 'Add Another' : 'Add to Cart'}
             </>
           )}
        </Button>
      </div>
    </div>
  );
});
