import { SetPasswordActionPayloadSchema } from './operations/set-password.js';
import { SignUpVerificationActionPayloadSchema } from './operations/sign-up-verification.js';
import { SignUpActionPayloadSchema } from './operations/sign-up.js';
import { UserAttributeVerificationActionPayloadSchema } from './operations/user-attribute-verification.js';

export const ActionOperation = {
  SET_PASSWORD: 'set-password',

  USER_ATTRIBUTE_VERIFICATION: 'user-attribute-verification',

  SIGN_UP: 'sign-up',
  SIGN_UP_VERIFICATION: 'sign-up-verification',
} as const;

export type AnyActionOperation =
  (typeof ActionOperation)[keyof typeof ActionOperation];

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
  type ActionId,
  type ActionIdProperty,
} from './base.js';
export * from './operations/set-password.js';
export * from './operations/sign-up-verification.js';
export * from './operations/sign-up.js';
export * from './operations/user-attribute-verification.js';
