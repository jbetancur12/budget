import { z } from 'zod';

export const closeMonthSchema = z.object({
  body: z.object({
    closeOption: z.enum(['save', 'distribute']),
    pocketAmounts: z.record(z.string(), z.number().min(0)).optional(),
    currentMonthOffset: z.number().int().optional().default(0),
  }),
});
