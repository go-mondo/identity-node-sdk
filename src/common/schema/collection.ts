import { z } from 'zod';
import { type Pagination, PaginationSchema } from './pagination.js';

export const CollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({ items: z.array(itemSchema) });
export type Collection<I> = {
  items: I[];
};

export const PaginationCollectionSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema.optional(),
  });
export type PaginationCollection<I> = Collection<I> & {
  pagination?: Pagination;
};
