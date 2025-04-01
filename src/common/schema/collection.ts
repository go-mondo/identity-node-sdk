import { type } from 'arktype';
import { type Pagination, PaginationSchema } from './pagination.js';

export const CollectionSchema = type('<t>', { items: 't[]' });
export type Collection<I> = {
  items: I[];
};

export const PaginationCollectionSchema = type('<t>', {
  items: 't[]',
  pagination: PaginationSchema.optional(),
});
export type PaginationCollection<I> = Collection<I> & {
  pagination?: Pagination;
};
