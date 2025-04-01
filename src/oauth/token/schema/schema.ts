import { AuthorizationCodeSchema } from './grants/authorization-code.js';
import { ClientCredentialsSchema } from './grants/client-credentials.js';
import { RefreshTokenSchema } from './grants/refresh-token.js';

export * from './grants/authorization-code.js';
export * from './grants/client-credentials.js';
export * from './grants/refresh-token.js';

/**
 * Union(s)
 */
export const Schema = AuthorizationCodeSchema.or(ClientCredentialsSchema).or(
  RefreshTokenSchema
);
export type Payload = typeof Schema.inferOut;
