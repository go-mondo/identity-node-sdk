import { SetPasswordActionPayloadSchema } from './operations/set-password.js';
import { SignUpVerificationActionPayloadSchema } from './operations/sign-up-verification.js';
import { SignUpActionPayloadSchema } from './operations/sign-up.js';
import { UserAttributeVerificationActionPayloadSchema } from './operations/user-attribute-verification.js';

/**
 * Union
 */
export const ActionPayloadSchema = SetPasswordActionPayloadSchema.or(
  SignUpVerificationActionPayloadSchema
)
  .or(SignUpActionPayloadSchema)
  .or(UserAttributeVerificationActionPayloadSchema);
export type ActionPayload = typeof ActionPayloadSchema.inferOut;

export {
  ActionIdPropertySchema,
  ActionIdSchema,
  ActionOperation,
  type ActionId,
  type ActionIdProperty,
  type AnyActionOperation,
} from './base.js';
export * from './operations/set-password.js';
export * from './operations/sign-up-verification.js';
export * from './operations/sign-up.js';
export * from './operations/user-attribute-verification.js';
