//src/shared/utils/type-guards.ts
/**
 * Type guards and utility functions for safe type narrowing.
 * Eliminates unsafe `as any` type assertions throughout the codebase.
 */

import type { TebexPackage, BasketPackage } from '../types/tebex';

// Extend with optional fields that come from basket API responses
interface InBasketInfo {
  quantity: number;
  price: number;
}

interface PackageWithInBasket {
  in_basket: InBasketInfo;
}

interface PackageWithCategory {
  category: {
    id: number;
    name: string;
  };
}

/**
 * Type guard to check if a package has in_basket information.
 * Used when checking cart items from basket API response.
 */
export function hasInBasket(pkg: unknown): pkg is PackageWithInBasket {
  if (!pkg || typeof pkg !== 'object') return false;
  const p = pkg as Record<string, unknown>;
  return (
    'in_basket' in p &&
    p.in_basket !== null &&
    typeof p.in_basket === 'object' &&
    typeof (p.in_basket as Record<string, unknown>).quantity === 'number'
  );
}

/**
 * Type guard to check if a package has category information.
 */
export function hasCategory(pkg: unknown): pkg is PackageWithCategory {
  if (!pkg || typeof pkg !== 'object') return false;
  const p = pkg as Record<string, unknown>;
  return (
    'category' in p &&
    p.category !== null &&
    typeof p.category === 'object' &&
    typeof (p.category as Record<string, unknown>).name === 'string'
  );
}

/**
 * Safely get the quantity of a package in the basket.
 * Returns 0 if the package is not in the basket or has no quantity info.
 */
export function getInBasketQuantity(pkg: unknown): number {
  if (hasInBasket(pkg)) {
    return pkg.in_basket.quantity;
  }
  // Fallback for BasketPackage.qty
  if (pkg && typeof pkg === 'object' && 'qty' in pkg) {
    return (pkg as BasketPackage).qty ?? 0;
  }
  return 0;
}

/**
 * Safely get the price from in_basket or fallback to package price.
 * Handles various API response formats where price may be in different locations.
 */
export function getInBasketPrice(pkg: unknown): number {
  if (hasInBasket(pkg)) {
    return pkg.in_basket.price;
  }
  if (pkg && typeof pkg === 'object' && 'price' in pkg) {
    const price = (pkg as Record<string, unknown>).price;
    return typeof price === 'number' ? price : 0;
  }
  return 0;
}

/**
 * Get the display price for a package.
 * Handles various API formats: total_price, price, base_price.
 * The Zod schema normalizes this, but this is a safety fallback.
 */
export function getPackagePrice(pkg: unknown): number {
  if (!pkg || typeof pkg !== 'object') return 0;
  const p = pkg as Record<string, unknown>;

  // Priority: price (normalized by schema) > total_price > base_price
  if (typeof p.price === 'number') return p.price;
  if (typeof p.total_price === 'number') return p.total_price;
  if (typeof p.base_price === 'number') return p.base_price;

  return 0;
}

/**
 * Get the category name if available.
 */
export function getCategoryName(pkg: unknown): string | null {
  if (hasCategory(pkg)) {
    return pkg.category.name;
  }
  return null;
}

/**
 * Find a package in basket by ID.
 * Works with both TebexPackage[] and BasketPackage[].
 */
export function findPackageInBasket(
  packages: BasketPackage[] | TebexPackage[] | undefined,
  packageId: number
): BasketPackage | TebexPackage | undefined {
  return packages?.find((p) => p.id === packageId);
}
