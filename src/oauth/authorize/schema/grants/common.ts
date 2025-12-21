import * as z from 'zod/v4';

export const ExtraGrantSchema = z.object({
  /**
   * OPTIONAL. An audience identifier.
   */
  audience: z.string().optional(),

  /**
   * OPTIONAL. A device identifier.
   */
  device: z.string().optional(),
});
