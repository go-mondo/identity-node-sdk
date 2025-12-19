import * as z from 'zod/v4';
import { OptionalSchema, ResponseType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.2.1
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.2.2.1
 */

const ResponseTypeSchema = z.enum([
  ResponseType.TOKEN,
  ResponseType.ID_TOKEN,
  `${ResponseType.ID_TOKEN} ${ResponseType.TOKEN}`,
  `${ResponseType.TOKEN} ${ResponseType.ID_TOKEN}`,
] as const);

const OAuthSchema = z.object({
  response_type: ResponseTypeSchema,
  client_id: z.string(),
  redirect_uri: z.url().optional(),
  scope: z.string().optional(),
  state: z.string().optional(),
});

const OIDCSchema = z.object({
  nonce: z.string().optional(), // OIDC (this is required if resposne_type includes ID TOKEN)
});

export const ImplicitGrantAuthorizationSchema = z.object({
  ...OAuthSchema.shape,
  ...OIDCSchema.shape,
  ...OptionalSchema.shape,
});
export type ImplicitGrantAuthorizationInput = z.input<
  typeof ImplicitGrantAuthorizationSchema
>;
export type ImplicitGrantAuthorization = z.output<
  typeof ImplicitGrantAuthorizationSchema
>;
