import * as z from 'zod/v4';
import { UserIdSchema } from '../../../customer/schema.js';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const AuthenticationStatus = {
  SUCESS: 'success',
  FAIL: 'fail',
} as const;

export type AnyAuthenticationStatus =
  (typeof AuthenticationStatus)[keyof typeof AuthenticationStatus];

export const AuthenticationStatusSchema = z.enum([
  AuthenticationStatus.SUCESS,
  AuthenticationStatus.FAIL,
] as const);

const BaseAuthenticationSchema = z.object({
  type: z.literal('authentication'),
  status: AuthenticationStatusSchema,
  identity: UserIdSchema,
  message: z.string(),
});

export const AuthenticationActivitySchema = z.object({
  ...BaseSchema.shape,
  ...BaseAuthenticationSchema.shape,
});
export type AuthenticationActivityProperties = z.input<
  typeof AuthenticationActivitySchema
>;
export type AuthenticationActivity = z.output<
  typeof AuthenticationActivitySchema
>;

export const AuthenticationActivityPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  ...BaseAuthenticationSchema.shape,
});
export type AuthenticationActivityPayload = z.output<
  typeof AuthenticationActivityPayloadSchema
>;
