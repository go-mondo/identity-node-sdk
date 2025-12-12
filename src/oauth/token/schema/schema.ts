import * as z from 'zod/v4';

import { ScopeStringSchema } from '../../common/schema.js';
import { AuthorizationCodeRequestSchema } from './grants/authorization-code.js';
import { ClientCredentialsRequestSchema } from './grants/client-credentials.js';
import { RefreshTokenRequestSchema } from './grants/refresh-token.js';

export * from './grants/authorization-code.js';
export * from './grants/client-credentials.js';
export * from './grants/refresh-token.js';

/**
 * Union(s)
 */
export const RequestSchema = z.discriminatedUnion('grant_type', [
  AuthorizationCodeRequestSchema,
  ClientCredentialsRequestSchema,
  RefreshTokenRequestSchema,
]);
export type RequestInput = z.input<typeof RequestSchema>;
export type RequestPayload = z.output<typeof RequestSchema>;

/*
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.1
 */
export const ResponseSchema = z.object({
  /**
   * REQUIRED. The access token issued by the authorization server.
   * Typically a JWT or an opaque string.
   */
  access_token: z
    .string()
    .min(1)
    .describe('The access token issued by the authorization server.'),

  /**
   * REQUIRED. The type of the token issued. Value is typically 'Bearer'.
   */
  token_type: z
    .literal('Bearer')
    .default('Bearer')
    .describe('The type of the token issued. Must be "Bearer".'),

  /**
   * RECOMMENDED. The lifetime in seconds of the access token.
   * For example, the value 3600 represents an expiration time of one hour.
   */
  expires_in: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('The lifetime in seconds of the access token.'),

  /**
   * OPTIONAL. The refresh token, which can be used to obtain a new access token
   * when the current one expires.
   */
  refresh_token: z.string().min(1).optional().describe('The refresh token.'),

  /**
   * OPTIONAL. The scope of the access token as issued by the authorization server.
   * If omitted, the scope is the same as the scope originally requested by the client.
   */
  scope: ScopeStringSchema.optional(),

  /**
   * OPTIONAL, for OpenID Connect (OIDC). The ID token, a JWT that contains claims
   * about the authentication of the end-user.
   */
  id_token: z.string().min(1).optional().describe('The ID Token (OIDC only).'),
});

export type ResponseInput = z.input<typeof ResponseSchema>;
export type ResponsePayload = z.output<typeof ResponseSchema>;
