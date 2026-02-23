//scr/modules/store/cart.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tebexService, TebexApiError } from './tebex.service';
import type { TebexBasket, BasketPackage } from '../../shared/types/tebex';
import { findPackageInBasket, getInBasketPrice, getPackagePrice } from '../../shared/utils/type-guards';

interface CartState {
  basket: TebexBasket | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  isOpen: boolean;
  pendingPackageId: number | null; // Store item ID to retry after auth

  // Actions
  toggleCart: () => void;
  setIsAuthenticating: (status: boolean) => void;
  initializeCart: () => Promise<void>;
  addItem: (packageId: number) => Promise<void>;
  removeItem: (packageId: number) => Promise<void>; 
  completeAuth: () => Promise<void>; // New action to handle post-auth flow
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      basket: null,
      isLoading: false,
      isAuthenticating: false,
      isOpen: false,
      pendingPackageId: null,

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setIsAuthenticating: (status) => set({ isAuthenticating: status }),

      initializeCart: async () => {
        const { basket } = get();
        if (basket?.ident) {
          try {
            set({ isLoading: true });
            const updatedBasket = await tebexService.getBasket(basket.ident);
            set({ basket: updatedBasket, isLoading: false });
          } catch (error) {
            set({ basket: null, isLoading: false });
          }
        }
      },

      // Called after successful auth from App.tsx
      completeAuth: async () => {
        const { basket, pendingPackageId, addItem } = get();
        
        // 1. Refresh Basket (Auth might have merged baskets or updated state)
        if (basket?.ident) {
            try {
                set({ isLoading: true });
                const updatedBasket = await tebexService.getBasket(basket.ident);
                set({ basket: updatedBasket, isLoading: false });
            } catch {
                // Basket refresh failed - continue with auth flow anyway
            }
        }

        // 2. Retry pending item if exists
        if (pendingPackageId) {
            await addItem(pendingPackageId);
            set({ pendingPackageId: null }); // Clear pending
        }
      },

      addItem: async (packageId: number) => {
        set({ isLoading: true });
        let { basket } = get();

        try {
          if (!basket) {
            const currentUrl = window.location.href;
            basket = await tebexService.createBasket(currentUrl, currentUrl);
            set({ basket });
          }

          if (basket) {
            const updatedBasket = await tebexService.addToBasket(basket.ident, packageId, 1);
            set({ basket: updatedBasket, isLoading: false, isOpen: true });
          }
        } catch (error: unknown) {
          // Check if this is an auth-required error from Tebex
          const isTebexError = error instanceof TebexApiError;
          const statusCode = isTebexError ? error.statusCode : undefined;
          const errorDetails = isTebexError ? error.details as { detail?: string } | undefined : undefined;
          const isLoginRequired = statusCode === 422 && errorDetails?.detail?.includes('login');

          if (isLoginRequired) {
             const { basket } = get();
             if (basket) {
               try {
                 // Save item to retry later
                 set({ pendingPackageId: packageId });

                 const currentUrl = new URL(window.location.href);
                 currentUrl.searchParams.set('auth_callback', 'true');
                 const returnUrl = currentUrl.toString();
                 
                 const authLinks = await tebexService.getAuthUrl(basket.ident, returnUrl);
                 
                 if (authLinks && authLinks.length > 0) {
                   const url = authLinks[0].url;
                   const width = 600;
                   const height = 800;
                   const left = window.screen.width / 2 - width / 2;
                   const top = window.screen.height / 2 - height / 2;
                   
                   set({ isAuthenticating: true }); 

                   window.open(
                     url, 
                     'TebexAuth', 
                     `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
                   );
                   return;
                 }
               } catch {
                 // Auth URL fetch failed - fall through to loading state reset
               }
             }
          }

          set({ isLoading: false });
        }
      },

      removeItem: async (packageId: number) => {
          const { basket } = get();
          if (!basket) return;

          // 1. Optimistic Update: Remove item locally immediately
          const previousBasket = basket;
          const optimisticPackages = basket.packages.filter((p: BasketPackage) => p.id !== packageId);

          // Recalculate totals using type guards
          const removedItem = findPackageInBasket(basket.packages, packageId);
          const removedPrice = getInBasketPrice(removedItem) || getPackagePrice(removedItem);
          const newTotal = Math.max(0, (basket.total_price || 0) - removedPrice);

          set({ 
              basket: { 
                  ...basket, 
                  packages: optimisticPackages,
                  total_price: newTotal, // Update total price optimistically
                  base_price: Math.max(0, (basket.base_price || 0) - removedPrice) // Update base price
              },
              isLoading: false 
          });

          try {
              // 2. API Call in background
              const updatedBasket = await tebexService.removePackage(basket.ident, packageId);
              
              // 3. Sync with server response (Source of Truth)
              set({ basket: updatedBasket });
          } catch {
              // Rollback on error
              set({ basket: previousBasket });
          }
      }
    }),
    {
      name: 'tebex-cart-storage', // LocalStorage key
      partialize: (state) => ({ basket: state.basket }), // Only persist basket data, not UI state
    }
  )
);
