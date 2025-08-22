import { z } from 'zod';
import { GrantType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.3.1
 */

const GrantTypeSchema = z.enum([GrantType.AUTHORIZATION_CODE] as const);

const PKCESchema = z.object({
  code_verifier: z.string().optional(),
});

export const AuthorizationCodeSchema = z.object({
  grant_type: GrantTypeSchema,
  code: z.string(),
  client_id: z.string(),
  client_secret: z.string().optional(),
  redirect_uri: z.url(),
  ...PKCESchema.shape,
});
export type AuthorizationCodePayload = z.output<typeof AuthorizationCodeSchema>;
