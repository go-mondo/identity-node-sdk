import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { IdentityIdentifierSchema } from '../../../identity/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SignUpVerificationActionPayloadSchema = BasePayloadSchema.and({
  operation: type("'sign-up-verification'"),
  user: UserIdSchema,
  identifier: IdentityIdentifierSchema,
}).onUndeclaredKey('delete');
export type SignUpVerificationActionPayload =
  typeof SignUpVerificationActionPayloadSchema.inferOut;

export const SignUpVerificationActionRequestSchema = type({
  code: type('string'),
}).onUndeclaredKey('delete');
export type SignUpVerificationActionRequest =
  typeof SignUpVerificationActionRequestSchema.inferOut;
