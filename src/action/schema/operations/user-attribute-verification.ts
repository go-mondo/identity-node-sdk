import * as z from 'zod/v4';
import { UserIdSchema } from '../../../customer/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema.js';
import { BasePayloadSchema } from '../base.js';

export const UserAttributeVerificationActionPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  operation: z.literal('user-attribute-verification'),
  user: UserIdSchema,
  attribute: IdentityIdentifierSchema,
});
export type UserAttributeVerificationActionPayload = z.output<
  typeof UserAttributeVerificationActionPayloadSchema
>;

export const UserAttributeVerificationActionRequestSchema = z.object({});
export type UserAttributeVerificationActionRequest = z.output<
  typeof UserAttributeVerificationActionRequestSchema
>;
