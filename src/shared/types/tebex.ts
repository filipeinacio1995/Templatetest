//src/shared/types/tebex.ts
// Re-export types from Zod schema to maintain backward compatibility
// and ensure single source of truth.

export type {
  TebexCategory,
  TebexPackage,
  TebexBasket,
  TebexAuthLink,
  BasketPackage
} from '../schemas/tebex.schema';

export interface TebexResponse<T> {
  data: T;
}