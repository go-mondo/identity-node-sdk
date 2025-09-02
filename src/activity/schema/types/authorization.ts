import * as z from 'zod/v4';
import { UserIdSchema } from '../../../customer/schema.js';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const AuthorizationStatus = {
  SUCESS: 'success',
  FAIL: 'fail',
} as const;

export type AnyAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

export const AuthorizationStatusSchema = z.enum([
  AuthorizationStatus.SUCESS,
  AuthorizationStatus.FAIL,
] as const);

const BaseAuthorizationSchema = z.object({
  type: z.literal('authorization'),
  status: AuthorizationStatusSchema,
  identity: UserIdSchema.optional(),
  message: z.string(),
});

export const AuthorizationActivitySchema = z.object({
  ...BaseSchema.shape,
  ...BaseAuthorizationSchema.shape,
});
export type AuthorizationActivityProperties = z.input<
  typeof AuthorizationActivitySchema
>;
export type AuthorizationActivity = z.output<
  typeof AuthorizationActivitySchema
>;

export const AuthorizationActivityPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  ...BaseAuthorizationSchema.shape,
});
export type AuthorizationActivityPayload = z.output<
  typeof AuthorizationActivityPayloadSchema
>;
