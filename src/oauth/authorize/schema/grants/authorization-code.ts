import * as z from 'zod/v4';
import { AppIdSchema } from '../../../../app/schema.js';
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

const ResponseTypeSchema = z.enum([ResponseType.CODE] as const);

export const CodeChallengeSchema = z
  .string()
  .min(43, 'Code challenge must be at least 43 characters long.')
  .max(128, 'Code challenge must be at most 128 characters long.')
  .regex(/^[A-Za-z0-9\-_.~]+$/, 'Code challenge contains invalid characters.') // Base64url-encoded string
  .describe('PKCE code challenge, derived from the code verifier.');

// const PKCESchema = z.union([
//   z.object({
//     code_challenge_method: CodeChallengeMethodSchema.optional(),
//     code_challenge: z.string().optional(),
//   }),
//   z.object({
//     code_challenge_method: CodeChallengeMethodSchema,
//     code_challenge: z.string().min(1),
//   })
// ]).refine((data) => {
//   return (
//     (data.code_challenge_method && data.code_challenge) ||
//     (!data.code_challenge_method && !data.code_challenge)
//   );
// }, {
//   message: 'code_challenge and code_challenge_method must both be present or both be absent',
// });

const OAuthSchema = z.object({
  response_type: ResponseTypeSchema.describe(
    'Must be set to "code" for Authorization Code flow.'
  ),
  client_id: AppIdSchema.describe('The Client ID.'),
  redirect_uri: z.url().optional().describe('The callback URL.'),
  scope: z
    .string()
    .min(1)
    .optional()
    .describe('Space-delimited scope strings.'),
  state: z.string().min(1).optional().describe('Opaque value to prevent CSRF.'),
});

const OIDCSchema = z.object({
  nonce: z.string().optional(),
  display: AuthorizationDisplaySchema.optional(),
  prompt: AuthorizationPromptSchema.optional(),
  max_age: z.number().int().min(0).optional(),
});

export const AuthorizationCodeGrantAuthorizationSchema = z
  .object({
    ...OAuthSchema.shape,
    ...OIDCSchema.shape,
    ...OptionalSchema.shape,
    code_challenge_method: CodeChallengeMethodSchema.optional(),
    code_challenge: CodeChallengeSchema.optional(),
  })
  .superRefine((data, ctx) => {
    // If one is present, the other must also be present
    if (data.code_challenge && !data.code_challenge_method) {
      ctx.addIssue({
        code: 'custom',
        message:
          'code_challenge_method is required when code_challenge is present',
        path: ['code_challenge_method'],
      });
    } else if (!data.code_challenge && data.code_challenge_method) {
      ctx.addIssue({
        code: 'custom',
        message:
          'code_challenge is required when code_challenge_method is present',
        path: ['code_challenge'],
      });
    }
  });
export type AuthorizationCodeGrantAuthorizationInput = z.input<
  typeof AuthorizationCodeGrantAuthorizationSchema
>;
export type AuthorizationCodeGrantAuthorization = z.output<
  typeof AuthorizationCodeGrantAuthorizationSchema
>;
