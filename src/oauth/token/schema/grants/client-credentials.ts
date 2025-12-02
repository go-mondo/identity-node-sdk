import * as z from 'zod/v4';
import {
  GrantType,
  OptionalSchema,
  ScopeSchema,
} from '../../../common/schema.js';
import { ClientRequestSchema } from './common.js';

/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.4.2
 */

const GrantTypeSchema = z.enum([GrantType.CLIENT_CREDENTIALS] as const);

/**
 * Note: Prior to using this schema, the headers should be checked for
 * HTTP Basic Authentication. If present, the client_id and client_secret
 * should be included in with the payload before parsing.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.4.2
 */
export const ClientCredentialsRequestSchema = z.object({
  /**
   * REQUIRED. Value MUST be set to "client_credentials".
   */
  grant_type: GrantTypeSchema.describe('The grant type.'),

  /**
   * OPTIONAL. The scope of the access request.
   */
  scope: ScopeSchema.optional(),

  ...ClientRequestSchema.shape,
  ...OptionalSchema.shape,
});
export type ClientCredentialsRequestInput = z.input<
  typeof ClientCredentialsRequestSchema
>;
export type ClientCredentialsRequestPayload = z.output<
  typeof ClientCredentialsRequestSchema
>;
