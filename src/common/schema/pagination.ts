import * as z from 'zod/v4';

const PaginationPropertiesSchema = z.object({
  pageSize: z
    .union([z.string(), z.number(), z.null()])
    .pipe(z.transform((v) => (v ? Number(v) : undefined)))
    .optional(),
  nextToken: z
    .union([z.string(), z.null()])
    .pipe(z.transform((v) => v || undefined))
    .optional(),
});

export type Pagination = z.output<typeof PaginationPropertiesSchema>;

export const PaginationSchema = z.object({
  pagination: PaginationPropertiesSchema.optional(),
});

export type PaginationInput = z.input<typeof PaginationSchema>;
export type PaginationPayload = z.output<typeof PaginationSchema>;
