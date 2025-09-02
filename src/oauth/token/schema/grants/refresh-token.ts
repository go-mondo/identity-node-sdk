import * as z from 'zod/v4';
import { AppIdSchema } from '../../../../app/schema.js';
import { GrantType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
 */
const GrantTypeSchema = z.enum([GrantType.REFRESH_TOKEN] as const);

export const RefreshTokenSchema = z.object({
  grant_type: GrantTypeSchema,
  refresh_token: z.string(),
  scope: z.string().optional(),
  client_id: AppIdSchema,
  client_secret: z.string(),
});
export type RefreshTokenPayload = z.output<typeof RefreshTokenSchema>;
