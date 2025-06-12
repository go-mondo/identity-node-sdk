import { type } from 'arktype';
import { UserIdSchema } from '../../../customer/users/schema.js';
import { BasePayloadSchema, BaseSchema } from '../base.js';

export const AuthorizationStatus = {
  SUCESS: 'success',
  FAIL: 'fail',
} as const;

export type AnyAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

export const AuthorizationStatusSchema = type.enumerated(
  AuthorizationStatus.SUCESS,
  AuthorizationStatus.FAIL
);

const BaseAuthorizationSchema = type({
  type: type("'authorization'"),
  status: AuthorizationStatusSchema,
  identity: UserIdSchema.optional(),
  message: type('string'),
});

export const AuthorizationActivitySchema = BaseSchema.and(
  BaseAuthorizationSchema
);
export type AuthorizationActivityProperties =
  typeof AuthorizationActivitySchema.inferIn;
export type AuthorizationActivity = typeof AuthorizationActivitySchema.inferOut;

export const AuthorizationActivityPayloadSchema = BasePayloadSchema.and(
  BaseAuthorizationSchema
);
export type AuthorizationActivityPayload =
  typeof AuthorizationActivityPayloadSchema.inferOut;
