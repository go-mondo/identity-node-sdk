import { z } from 'zod';

import { AuthorizationCodeSchema } from './grants/authorization-code.js';
import { ClientCredentialsSchema } from './grants/client-credentials.js';
import { RefreshTokenSchema } from './grants/refresh-token.js';

export * from './grants/authorization-code.js';
export * from './grants/client-credentials.js';
export * from './grants/refresh-token.js';

/**
 * Union(s)
 */
export const Schema = z.discriminatedUnion('grant_type', [
  AuthorizationCodeSchema,
  ClientCredentialsSchema,
  RefreshTokenSchema,
]);
export type Payload = z.output<typeof Schema>;
