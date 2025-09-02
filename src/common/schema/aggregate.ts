import * as z from 'zod/v4';

export const AggregateSchema = z.object({
  ids: z.array(z.string()).optional(),
  count: z.number().optional(),
});
export type Aggregate = z.output<typeof AggregateSchema>;
