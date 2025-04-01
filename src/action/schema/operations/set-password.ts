import { type } from 'arktype';
import { PasswordPolicySchema } from '../../../authentication/schema/schema.js';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SetPasswordActionPayloadSchema = BasePayloadSchema.and({
  operation: type("'set-password'"),
  user: UserIdSchema,
  identifier: IdentityIdentifierSchema,
  policy: PasswordPolicySchema,
}).onUndeclaredKey('delete');
export type SetPasswordActionPayload =
  typeof SetPasswordActionPayloadSchema.inferOut;

export const SetPasswordActionRequestSchema = type({
  code: type('string'),
  password: type('string'),
}).onUndeclaredKey('delete');
export type SetPasswordActionRequest =
  typeof SetPasswordActionRequestSchema.inferOut;
