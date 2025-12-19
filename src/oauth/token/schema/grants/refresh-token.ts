import * as z from 'zod/v4';
import { GrantType, ScopeStringSchema } from '../../../common/schema.js';
import { ClientRequestSchema } from './common.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
 */
const GrantTypeSchema = z.enum([GrantType.REFRESH_TOKEN] as const);

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
 */
export const RefreshTokenGrantTokenSchema = z.object({
  /**
   * REQUIRED. Value MUST be set to "refresh_token".
   */
  grant_type: GrantTypeSchema.describe('The grant type.'),

  /**
   * REQUIRED. The refresh token issued to the client.
   */
  refresh_token: z.string().min(1).describe('The refresh token.'),

  /**
   * OPTIONAL. The scope of the access request. If omitted, the scope is
   * unchanged from the original grant. If specified, it must be equal to or
   * a subset of the original scope.
   */
  scope: ScopeStringSchema.optional(),

  ...ClientRequestSchema.shape,
});
export type RefreshTokenGrantTokenInput = z.input<
  typeof RefreshTokenGrantTokenSchema
>;
export type RefreshTokenGrantToken = z.output<
  typeof RefreshTokenGrantTokenSchema
>;
