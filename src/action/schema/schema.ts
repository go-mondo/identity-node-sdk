import { z } from 'zod';

import { SignUpVerificationActionPayloadSchema } from './operations/sign-up-verification.js';
import { SignUpActionPayloadSchema } from './operations/sign-up.js';
import { UserAttributeVerificationActionPayloadSchema } from './operations/user-attribute-verification.js';

/**
 * Union
 */
export const ActionPayloadSchema = z.discriminatedUnion('operation', [
  SignUpVerificationActionPayloadSchema,
  SignUpActionPayloadSchema,
  UserAttributeVerificationActionPayloadSchema,
]);
export type ActionPayload = z.output<typeof ActionPayloadSchema>;

export {
  ActionIdPropertySchema,
  ActionIdSchema,
  ActionOperation,
  type ActionId,
  type ActionIdProperty,
  type AnyActionOperation,
} from './base.js';
export * from './operations/sign-up-verification.js';
export * from './operations/sign-up.js';
export * from './operations/user-attribute-verification.js';
export * from './utils.js';
