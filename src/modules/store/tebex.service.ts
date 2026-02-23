//scr/modules/store/tebex.service.ts
import axios from 'axios';
import { config } from '../../config/store.config';
import { 
  TebexResponseSchema, 
  TebexCategorySchema, 
  TebexPackageSchema, 
  TebexBasketSchema,
  type TebexCategory,
  type TebexPackage,
  type TebexBasket,
  TebexAuthLinkSchema
} from '../../shared/schemas/tebex.schema';
import { z } from 'zod';

const API_URL = 'https://headless.tebex.io/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class TebexApiError extends Error {
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'TebexApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Helper to parse response
const parseResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new TebexApiError('Invalid API response format', 500, result.error);
  }
  return result.data;
};

export const tebexService = {
  /**
   * Fetch all categories, optionally including packages.
   */
  getCategories: async (includePackages = true): Promise<TebexCategory[]> => {
    try {
      const response = await api.get(`/accounts/${config.tebexToken}/categories`, {
        params: { includePackages: includePackages ? 1 : 0 }
      });
      
      const schema = TebexResponseSchema(z.array(TebexCategorySchema));
      const parsed = parseResponse(schema, response.data);
      return parsed.data;
    } catch (error) {
      handleError(error);
      return []; // unreachable
    }
  },

  /**
   * Get a specific package details
   */
  getPackage: async (packageId: number): Promise<TebexPackage> => {
    try {
      const response = await api.get(`/accounts/${config.tebexToken}/packages/${packageId}`);
      const schema = TebexResponseSchema(TebexPackageSchema);
      return parseResponse(schema, response.data).data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create a new shopping basket.
   */
  createBasket: async (successUrl: string, cancelUrl: string): Promise<TebexBasket> => {
    try {
      const response = await api.post(`/accounts/${config.tebexToken}/baskets`, {
        complete_url: successUrl,
        cancel_url: cancelUrl,
        custom: {},
      });
      const schema = TebexResponseSchema(TebexBasketSchema);
      return parseResponse(schema, response.data).data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get existing basket
   */
  getBasket: async (basketIdent: string): Promise<TebexBasket> => {
    try {
      const response = await api.get(`/accounts/${config.tebexToken}/baskets/${basketIdent}`);
      const schema = TebexResponseSchema(TebexBasketSchema);
      return parseResponse(schema, response.data).data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Add package to basket
   */
addToBasket: async (basketIdent: string, packageId: number, quantity = 1): Promise<TebexBasket> => {
  try {
    const response = await api.post(
      `/baskets/${basketIdent}/packages`,
      {
        package_id: packageId,
        quantity,
      }
    );

    const schema = TebexResponseSchema(TebexBasketSchema);
    return parseResponse(schema, response.data).data;
  } catch (error) {
    throw handleError(error);
  }
},

  /**
   * Get authentication URL for the basket
   */
  getAuthUrl: async (basketIdent: string, returnUrl: string) => {
    try {
      const response = await api.get(
        `/accounts/${config.tebexToken}/baskets/${basketIdent}/auth`,
        { params: { returnUrl } }
      );
      
      // The API is inconsistent, handle both array and wrapped object
      if (Array.isArray(response.data)) {
         return z.array(TebexAuthLinkSchema).parse(response.data);
      }
      
      // If wrapped in data
      const schema = TebexResponseSchema(z.array(TebexAuthLinkSchema));
      const result = schema.safeParse(response.data);
      if (result.success) return result.data.data;
      
      return [];
    } catch {
      // Auth URL fetch failed - return empty to let caller handle
      return [];
    }
  },

  /**
   * Remove a package from the basket
   */
removePackage: async (basketIdent: string, packageId: number): Promise<TebexBasket> => {
  try {
    const response = await api.post(
      `/baskets/${basketIdent}/packages/remove`,
      { package_id: packageId }
    );

    const schema = TebexResponseSchema(TebexBasketSchema);
    return parseResponse(schema, response.data).data;
  } catch (error) {
    throw handleError(error);
  }
},
};

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    throw new TebexApiError(
      data?.message || error.message,
      error.response?.status,
      error.response?.data
    );
  }
  if (error instanceof z.ZodError) {
    throw new TebexApiError('Validation Error', 500, error.flatten());
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(String(error));
}

