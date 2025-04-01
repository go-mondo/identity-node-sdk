import { type } from 'arktype';

export const PaginationSchema = type({
  pageSize: type('string | number').optional(),
  nextToken: type('string').optional(),
});

export type Pagination = typeof PaginationSchema.inferOut;
