import * as z from 'zod/v4';
import { type PaginationPayload, PaginationSchema } from './pagination.js';

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
    ...PaginationSchema.shape,
  });
export type PaginationCollection<I> = Collection<I> & PaginationPayload;
