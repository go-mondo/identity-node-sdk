import type { z } from 'zod';

import { AuthorizationCodeAuthorizationSchema } from './grants/authorization-code.js';
import { ImplicitAuthorizationSchema } from './grants/implicit.js';

export * from './grants/authorization-code.js';
export * from './grants/implicit.js';

/**
 * Union(s)
 */
export const AuthorizationSchema = AuthorizationCodeAuthorizationSchema.or(
  ImplicitAuthorizationSchema
);
export type AuthorizationInput = z.input<typeof AuthorizationSchema>;
export type Authorization = z.output<typeof AuthorizationSchema>;

export { CodeChallengeSchema } from './grants/authorization-code.js';
