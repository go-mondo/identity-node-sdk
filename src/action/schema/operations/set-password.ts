import { z } from 'zod';
import { PasswordPolicySchema } from '../../../authentication/strategies/schema/schema.js';
import { UserIdSchema } from '../../../customer/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SetPasswordActionPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  operation: z.literal('set-password'),
  user: UserIdSchema,
  identifier: IdentityIdentifierSchema,
  policy: PasswordPolicySchema,
});
export type SetPasswordActionPayload = z.output<
  typeof SetPasswordActionPayloadSchema
>;

export const SetPasswordActionRequestSchema = z.object({
  code: z.string(),
  password: z.string(),
});
export type SetPasswordActionRequest = z.output<
  typeof SetPasswordActionRequestSchema
>;
