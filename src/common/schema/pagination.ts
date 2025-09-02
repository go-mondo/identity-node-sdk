import * as z from 'zod/v4';

export const PaginationSchema = z.object({
  pageSize: z.union([z.string(), z.number(), z.null()]).optional(),
  nextToken: z.union([z.string(), z.null()]).optional(),
});

export type Pagination = z.output<typeof PaginationSchema>;
