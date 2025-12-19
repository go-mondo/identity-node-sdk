import type { z } from 'zod';

import { AuthorizationCodeGrantAuthorizationSchema } from './grants/authorization-code.js';
import { ImplicitGrantAuthorizationSchema } from './grants/implicit.js';

export * from './grants/authorization-code.js';
export * from './grants/implicit.js';

/**
 * Union(s)
 */
export const AuthorizationSchema = AuthorizationCodeGrantAuthorizationSchema.or(
  ImplicitGrantAuthorizationSchema
);
export type AuthorizationInput = z.input<typeof AuthorizationSchema>;
export type Authorization = z.output<typeof AuthorizationSchema>;

export { CodeChallengeSchema } from './grants/authorization-code.js';
