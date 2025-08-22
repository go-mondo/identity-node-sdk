import { z } from 'zod';
import { AppIdSchema } from '../../../../app/schema.js';
import { GrantType, OptionalSchema } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.4.2
 */

const GrantTypeSchema = z.enum([GrantType.CLIENT_CREDENTIALS] as const);

/**
 * What the incoming body may look like.
 *
 * Note: the client_id and client_secrete may (likely) be in Authorization header
 */
export const ClientCredentialsPayloadSchema = z.object({
  grant_type: GrantTypeSchema,
  scope: z.string().optional(),
  client_id: AppIdSchema.optional(),
  client_secret: z.string().optional(),
  ...OptionalSchema.shape,
});

export const ClientCredentialsSchema = z.object({
  ...ClientCredentialsPayloadSchema.omit({
    client_id: true,
    client_secret: true,
  }).shape,
  client_id: AppIdSchema,
  client_secret: z.string(),
});
export type ClientCredentialsPayload = z.output<typeof ClientCredentialsSchema>;
