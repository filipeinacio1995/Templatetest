//src/shared/utils/price.ts
import { config } from '../../config/store.config';

export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return `0.00 ${config.currency}`;

  return `${numPrice.toFixed(2)} ${config.currency}`;
};
