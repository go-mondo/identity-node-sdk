import { type } from 'arktype';
import { OptionalSchema, ResponseType } from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.2.1
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.2.2.1
 */

const ResponseTypeSchema = type.enumerated(
  ResponseType.TOKEN,
  ResponseType.ID_TOKEN,
  `${typeof ResponseType.ID_TOKEN} ${typeof ResponseType.TOKEN}`,
  `${typeof ResponseType.TOKEN} ${typeof ResponseType.ID_TOKEN}`
);

const OAuthSchema = type({
  response_type: ResponseTypeSchema,
  client_id: type('string'),
  redirect_uri: type('string.url').optional(),
  scope: type('string').optional(),
  state: type('string').optional(),
});

const OIDCSchema = type({
  nonce: type('string').optional(), // OIDC (this is required if resposne_type includes ID TOKEN)
});

export const ImplicitSchema = OAuthSchema.and(OIDCSchema).and(OptionalSchema);
export type ImplicitPayload = typeof ImplicitSchema.inferOut;
