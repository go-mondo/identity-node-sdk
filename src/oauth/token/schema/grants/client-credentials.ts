import { type } from 'arktype';
import { AppIdSchema } from '../../../../app/schema/app.js';
import { GrantType, OptionalSchema } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.4.2
 */

const GrantTypeSchema = type.enumerated(GrantType.CLIENT_CREDENTIALS);

/**
 * What the incoming body may look like.
 *
 * Note: the client_id and client_secrete may (likely) be in Authorization header
 */
export const ClientCredentialsPayloadSchema = type({
  grant_type: GrantTypeSchema,
  scope: type('string').optional(),
  client_id: AppIdSchema.optional(),
  client_secret: type('string').optional(),
}).and(OptionalSchema);

export const ClientCredentialsSchema = ClientCredentialsPayloadSchema.omit(
  'client_id',
  'client_secret'
).and({
  client_id: AppIdSchema,
  client_secret: type('string'),
});
export type ClientCredentialsPayload = typeof ClientCredentialsSchema.inferOut;
