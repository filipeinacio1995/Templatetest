//src/shared/schemas/tebex.schema.ts
import { z } from "zod";

// helper for number OR numeric string
const num = z.union([z.number(), z.string().transform((v) => parseFloat(v))]);

// --- Package & Category Schemas ---

export const TebexPackageSchema = z
  .object({
    id: z.number(),
    name: z.string(),

    slug: z.string().nullable().optional(), // <-- FIX: can be null
    description: z.string().nullable().optional().default(""),

    // Tebex headless usually provides these:
    total_price: num.optional(),
    base_price: num.optional(),

    // optional fallback if some endpoints include "price"
    price: num.optional(),

    currency: z.string().optional(),

    image: z.string().nullable().optional(),

    // Tebex returns category object inside packages
    category: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .optional(),

    order: z.number().optional().default(0),

    // Tebex returns these often; allow them if present
    disable_quantity: z.boolean().optional(),
    disable_gifting: z.boolean().optional(),
    expiration_date: z.string().nullable().optional(),
    user_limit: z.number().nullable().optional(),

    // sometimes present
    type: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    discount: num.optional(),
    sales_tax: num.optional(),
  })
  .passthrough() // <-- IMPORTANT: allow extra fields like "media"
  .transform((data) => ({
    ...data,
    // always expose a consistent "price" for your UI
    price: (data.total_price ?? data.price ?? data.base_price ?? 0) as number,
    description: data.description ?? "",
  }));

export const TebexCategorySchema = z
  .object({
    id: z.number(),
    name: z.string(),

    slug: z.string().nullable().optional(), // <-- FIX: can be null
    description: z.string().nullable().optional().default(""),

    packages: z.array(TebexPackageSchema).optional().default([]),

    order: z.number().optional().default(0),

    // present in your JSON (and can be null)
    display_type: z.string().nullable().optional(),
    image_url: z.string().nullable().optional(),
    parent: z.any().nullable().optional(),
    tiered: z.boolean().optional(),
  })
  .passthrough()
  .transform((data) => ({
    ...data,
    description: data.description ?? "",
  }));

// --- Basket Schemas ---

export const BasketPackageSchema = z
  .object({
    id: z.number(),
    qty: z.number().optional().default(1),
    package: TebexPackageSchema.optional(),
    name: z.string().optional(),
    price: num.optional(),
    image: z.string().nullable().optional(),
  })
  .passthrough();

export const TebexBasketSchema = z
  .object({
    ident: z.string(),
    expire: z.string().optional(),

    base_price: num.optional(),
    sales_tax: num.optional(),
    total_price: num.optional(),
    currency: z.string().optional(),

    username: z.string().nullable().optional(),
    packages: z.array(BasketPackageSchema).default([]),

    links: z
      .union([
        z.object({ checkout: z.string().optional() }),
        z.array(z.any()),
      ])
      .transform((val) => {
        if (Array.isArray(val)) {
          const checkoutLink = val.find((l: any) => l.rel === "checkout");
          return { checkout: checkoutLink?.href };
        }
        return val;
      })
      .optional(),
  })
  .passthrough();

// --- Auth & Responses ---

export const TebexAuthLinkSchema = z.object({
  name: z.string().optional(),
  url: z.string(),
});

export const TebexResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({ data: schema });

// Types
export type TebexPackage = z.infer<typeof TebexPackageSchema>;
export type TebexCategory = z.infer<typeof TebexCategorySchema>;
export type TebexBasket = z.infer<typeof TebexBasketSchema>;
export type TebexAuthLink = z.infer<typeof TebexAuthLinkSchema>;
export type BasketPackage = z.infer<typeof BasketPackageSchema>;
