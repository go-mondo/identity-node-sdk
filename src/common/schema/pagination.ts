import { type } from 'arktype';

export const PaginationSchema = type({
  pageSize: type('string | number | null').optional(),
  nextToken: type('string | null').optional(),
});

export type Pagination = typeof PaginationSchema.inferOut;
