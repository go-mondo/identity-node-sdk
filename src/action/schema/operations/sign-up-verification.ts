import { z } from 'zod';
import { UserIdSchema } from '../../../customer/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SignUpVerificationActionPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  operation: z.literal('sign-up-verification'),
  user: UserIdSchema,
  identifier: IdentityIdentifierSchema,
});
export type SignUpVerificationActionPayload = z.output<
  typeof SignUpVerificationActionPayloadSchema
>;

export const SignUpVerificationActionRequestSchema = z.object({
  code: z.string(),
});
export type SignUpVerificationActionRequest = z.output<
  typeof SignUpVerificationActionRequestSchema
>;
