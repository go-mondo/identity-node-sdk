import type { z } from 'zod';

import { AuthorizationCodeGrantAuthorizationSchema } from './grants/authorization-code.js';
import { ImplicitGrantAuthorizationSchema } from './grants/implicit.js';

export * from './grants/authorization-code.js';
export * from './grants/implicit.js';

/**
 * Union(s)
 */
export const AuthorizationGrantSchema =
  AuthorizationCodeGrantAuthorizationSchema.or(
    ImplicitGrantAuthorizationSchema
  );
export type AuthorizationGrantInput = z.input<typeof AuthorizationGrantSchema>;
export type AuthorizationGrant = z.output<typeof AuthorizationGrantSchema>;

export { CodeChallengeSchema } from './grants/authorization-code.js';
