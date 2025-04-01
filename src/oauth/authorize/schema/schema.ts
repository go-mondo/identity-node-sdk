import { AuthorizationCodeSchema } from './grants/authorization-code.js';
import { ImplicitSchema } from './grants/implicit.js';

export * from './grants/authorization-code.js';
export * from './grants/implicit.js';

/**
 * Union(s)
 */
export const Schema = AuthorizationCodeSchema.or(ImplicitSchema);
export type Payload = typeof Schema.inferOut;
