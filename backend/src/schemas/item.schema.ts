import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.number().optional().default(0),
    type: z.enum(['Fijo', 'Variable']).optional().default('Variable'),
    categoryId: z.number().int(),
    monthOffset: z.number().int().optional().default(0),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    recurring: z.boolean().optional().default(false),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    amount: z.number().optional(),
    type: z.enum(['Fijo', 'Variable']).optional(),
    recurring: z.boolean().optional(),
    categoryId: z.number().int().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const getItemsSchema = z.object({
  query: z.object({
    categoryId: z.string().regex(/^\d+$/).optional(),
    monthOffset: z
      .string()
      .regex(/^-?\d+$/)
      .optional(),
    search: z.string().optional(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['income', 'expense']),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
