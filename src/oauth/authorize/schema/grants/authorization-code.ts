import { type } from 'arktype';
import { AppIdSchema } from '../../../../app/schema/app.js';
import {
  AuthorizationDisplaySchema,
  AuthorizationPromptSchema,
  CodeChallengeMethodSchema,
  OptionalSchema,
  ResponseType,
} from '../../../common/schema.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
 * @see https://openid.net/specs/openid-connect-core-1_0.html#rfc.section.3.1.2.1
 */

const ResponseTypeSchema = type.enumerated(ResponseType.CODE);

const PKCESchema = type({
  code_challenge_method: CodeChallengeMethodSchema.optional(),
  code_challenge: type('string').optional(),
}).or({
  code_challenge_method: CodeChallengeMethodSchema,
  code_challenge: type('string'),
});

const OAuthSchema = type({
  response_type: ResponseTypeSchema,
  client_id: AppIdSchema,
  redirect_uri: type('string.url').optional(),
  scope: type('string').optional(),
  state: type('string').optional(),
});

const OIDCSchema = type({
  nonce: type('string').optional(),
  display: AuthorizationDisplaySchema.optional(),
  prompt: AuthorizationPromptSchema.optional(),
  max_age: type('number').optional(),
});

export const AuthorizationCodeSchema = OAuthSchema.and(OIDCSchema)
  .and(PKCESchema)
  .and(OptionalSchema);
export type AuthorizationCodePayload = typeof AuthorizationCodeSchema.inferOut;
