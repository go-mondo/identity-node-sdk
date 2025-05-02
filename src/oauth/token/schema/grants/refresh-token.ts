import { type } from 'arktype';
import { AppIdSchema } from '../../../../app/schema.js';
import { GrantType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
 */
const GrantTypeSchema = type.enumerated(GrantType.REFRESH_TOKEN);

export const RefreshTokenSchema = type({
  grant_type: GrantTypeSchema,
  refresh_token: type('string'),
  scope: type('string').optional(),
  client_id: AppIdSchema,
  client_secret: type('string'),
});
export type RefreshTokenPayload = typeof RefreshTokenSchema.inferOut;
