import { type } from 'arktype';
import { GrantType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.1
 */

const GrantTypeSchema = type.enumerated(GrantType.AUTHORIZATION_CODE);

const PKCESchema = type({
  code_verifier: type('string').optional(),
});

export const AuthorizationCodeSchema = type({
  grant_type: GrantTypeSchema,
  code: type('string'),
  client_id: type('string'),
  client_secret: type('string').optional(),
  redirect_uri: type('string.url'),
}).and(PKCESchema);
export type AuthorizationCodePayload = typeof AuthorizationCodeSchema.inferOut;
