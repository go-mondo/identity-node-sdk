import * as z from 'zod/v4';
import { GrantType } from '../../../common/schema.js';
import { ClientRequestSchema } from './common.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.1
 */

const GrantTypeSchema = z.enum([GrantType.AUTHORIZATION_CODE] as const);

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 */
export const AuthorizationCodeGrantTokenSchema = z.object({
  /**
   * REQUIRED. Must be set to "authorization_code".
   */
  grant_type: GrantTypeSchema.describe('The grant type.'),

  /**
   * REQUIRED. The authorization code received from the authorization server.
   */
  code: z
    .string()
    .min(1)
    .describe('The authorization code received in the redirect.'),

  /**
   * REQUIRED. If the "redirect_uri" parameter was included in the
   * authorization request, it must be identical here.
   */
  redirect_uri: z
    .url()
    .optional()
    .describe('The callback URL used in the initial request.'),

  ...ClientRequestSchema.shape,

  /**
   * PKCE EXTENSION. REQUIRED if "code_challenge" was present in the authorization request.
   * The unhashed, original random string created by the client.
   */
  code_verifier: z.string().min(1).optional().describe('PKCE Code Verifier.'),
});
export type AuthorizationCodeGrantTokenInput = z.input<
  typeof AuthorizationCodeGrantTokenSchema
>;
export type AuthorizationCodeGrantToken = z.output<
  typeof AuthorizationCodeGrantTokenSchema
>;
