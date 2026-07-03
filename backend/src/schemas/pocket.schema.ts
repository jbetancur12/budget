import { z } from 'zod';

const pocketIconSchema = z.enum(['Shield', 'Plane', 'TrendingUp', 'BookOpen']);

export const createPocketSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    goal: z.number().min(0).optional().default(0),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color')
      .optional()
      .default('#3B82F6'),
    icon: pocketIconSchema.optional().default('Shield'),
  }),
});

export const updatePocketSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    goal: z.number().min(0).optional(),
    color: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/)
      .optional(),
    icon: pocketIconSchema.optional(),
    balance: z.number().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    amount: z.number(),
    monthOffset: z.number().int().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});
