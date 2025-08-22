import { z } from 'zod';
import { AppIdSchema } from '../../../app/schema.js';
import { UserIdSchema } from '../../../customer/schema.js';
import {
  RequiredEmailSchema,
  RequiredPhoneNumberSchema,
  UserNamePropertiesSchema,
} from '../../../customer/users/schema.js';
import { BasePayloadSchema } from '../base.js';

export const SignUpActionPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  operation: z.literal('sign-up'),
  app: AppIdSchema.optional(),
  user: UserNamePropertiesSchema,
});
export type SignUpActionPayload = z.output<typeof SignUpActionPayloadSchema>;

const EmailSignUpActionRequestSchema = z.object({
  ...UserNamePropertiesSchema.shape,
  email: RequiredEmailSchema,
  phoneNumber: RequiredPhoneNumberSchema.optional(),
  id: UserIdSchema.optional(),
});

const PhoneNumberSignUpActionRequestSchema = z.object({
  ...UserNamePropertiesSchema.shape,
  phoneNumber: RequiredPhoneNumberSchema,
  email: RequiredEmailSchema.optional(),
  id: UserIdSchema.optional(),
});

export const SignUpActionRequestSchema = z.union([
  EmailSignUpActionRequestSchema,
  PhoneNumberSignUpActionRequestSchema,
]);
export type SignUpActionRequest = z.output<typeof SignUpActionRequestSchema>;
