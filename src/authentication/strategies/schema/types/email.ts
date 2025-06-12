import { type } from 'arktype';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseStrategySchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

const TypeSchema = type({
  type: "'email'",
});

export const EmailStrategySchema = BaseStrategySchema.and(TypeSchema);
export type EmailStrategyProperties = typeof EmailStrategySchema.inferIn;
export type EmailStrategy = typeof EmailStrategySchema.inferOut;

export const EmailStrategyPayloadSchema =
  BaseStrategyPayloadSchema.and(TypeSchema);
export type EmailStrategyPayload = typeof EmailStrategyPayloadSchema.inferOut;

export const InsertEmailStrategyPayloadSchema = TypeSchema.and(
  BaseInsertStrategyPayloadSchema
).and(TypeSchema);
export type InsertEmailStrategyInput =
  typeof InsertEmailStrategyPayloadSchema.inferIn;
export type InsertEmailStrategyPayload =
  typeof InsertEmailStrategyPayloadSchema.inferOut;

export const UpdateEmailStrategyPayloadSchema = TypeSchema.and(
  BaseUpdateStrategyPayloadSchema
);
export type UpdateEmailStrategyInput =
  typeof UpdateEmailStrategyPayloadSchema.inferIn;
export type UpdateEmailStrategyPayload =
  typeof UpdateEmailStrategyPayloadSchema.inferOut;

export const VerifyEmailSchema = type({
  email: type('string.email').optional(),
  code: type('string').configure({
    message: 'A verification code is required',
  }),
});

export const SendEmailVerificationCodeSchema = type({
  email: type('string.email').optional(),
});
