import type { z } from 'zod';

import { AuthorizationCodeRequestSchema } from './grants/authorization-code.js';
import { ImplicitRequestSchema } from './grants/implicit.js';

export * from './grants/authorization-code.js';
export * from './grants/implicit.js';

/**
 * Union(s)
 */
export const RequestSchema = AuthorizationCodeRequestSchema.or(
  ImplicitRequestSchema
);
export type RequestInput = z.input<typeof RequestSchema>;
export type RequestPayload = z.output<typeof RequestSchema>;

export { CodeChallengeSchema } from './grants/authorization-code.js';
