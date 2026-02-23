//scr/pages/Store.Page.ts
import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tebexService } from '../modules/store/tebex.service';
import type { TebexCategory, TebexPackage } from '../shared/schemas/tebex.schema';
import { Hero } from '../modules/ui/Hero';
import { Features } from '../modules/ui/Features';
import { ProductCard } from '../modules/ui/ProductCard';
import { SearchBar } from '../modules/ui/SearchBar';
import { clsx } from 'clsx';
import { toast } from 'sonner';

import { Footer } from '../modules/ui/Footer';

// Lazy load heavy components
const ProductModal = lazy(() => import('../modules/ui/ProductModal').then(module => ({ default: module.ProductModal })));

export const StorePage = () => {
  const [activeCategory, setActiveCategory] = useState<TebexCategory | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TebexPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data Fetching with React Query
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const cats = await tebexService.getCategories(true);
      return cats.sort((a, b) => a.order - b.order);
    },
  });

  // Error Handling
  useEffect(() => {
    if (error) {
      toast.error('Failed to load store data. Please try again later.');
    }
  }, [error]);

  // Default Category Selection
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Memoized filter logic - prevents recalculation on unrelated state changes
  const displayPackages = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const allPackages = categories.flatMap(cat => cat.packages);
      return allPackages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Fallback to first category if activeCategory is null but categories exist
    const currentCategory = activeCategory || categories[0];
    return currentCategory?.packages || [];
  }, [categories, activeCategory, searchQuery]);

  return (
    <>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {selectedPackage && (
        <Suspense fallback={null}>
           <ProductModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
        </Suspense>
      )}
      
      <Hero />
      <Features />

      <div className="container mx-auto px-4 lg:px-8 flex-grow">

           {/* Category Tabs */}
           {!searchQuery && (
             <div className="flex justify-center mb-12">
               <div className="flex flex-wrap justify-center gap-4">
                 {isLoading ? (
                   Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="h-12 w-32 bg-white/5 -skew-x-12 animate-pulse" />
                   ))
                 ) : (
                   categories.map((cat) => (
                     <button
                       key={cat.id}
                       onClick={() => setActiveCategory(cat)}
                       className={clsx(
                         "relative px-8 py-3 text-lg font-black uppercase italic tracking-tighter transition-all duration-300 -skew-x-12 border-2",
                         (activeCategory?.id === cat.id || (!activeCategory && categories[0].id === cat.id))
                           ? "bg-primary border-primary text-white shadow-[5px_5px_0px_rgba(0,0,0,1)] scale-105 z-10" 
                           : "bg-black/40 border-white/10 text-white/80 hover:text-white hover:border-white hover:bg-black/60 hover:shadow-[5px_5px_0px_rgba(255,255,255,0.1)]"
                       )}
                     >
                       <span className="block skew-x-12">{cat.name}</span>
                     </button>
                   ))
                 )}
               </div>
             </div>
           )}

           {!searchQuery && (activeCategory || categories[0]) && (
              <div key={(activeCategory || categories[0]).id} className="mb-10 animate-fade-in text-center max-w-2xl mx-auto">
                 <div 
                   className="text-lg text-white/80 leading-relaxed drop-shadow-md" 
                   dangerouslySetInnerHTML={{ __html: (activeCategory || categories[0]).description }} 
                 />
              </div>
           )}

           {searchQuery && (
               <div className="text-center mb-10 animate-fade-in">
                   <h2 className="text-2xl font-bold text-white">
                       Search Results for "{searchQuery}"
                   </h2>
                   <p className="text-text-muted mt-2">
                       Found {displayPackages.length} matches
                   </p>
               </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[16/10] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                ))
              ) : displayPackages.length > 0 ? (
                displayPackages.map((pkg) => (
                   <div key={pkg.id} className="animate-fade-in">
                      <ProductCard pkg={pkg} onViewDetails={setSelectedPackage} />
                   </div>
                ))
              ) : (
                 <div className="col-span-full py-32 text-center">
                    <p className="text-2xl text-white/30 font-bold uppercase tracking-widest">Nothing found</p>
                 </div>
              )}
           </div>
      </div>
      
      <Footer />
    </>
  );
};
