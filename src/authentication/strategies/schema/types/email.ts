import { z } from 'zod';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseStrategySchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

const TypeSchema = z.object({
  type: z.literal('email'),
});

export const EmailStrategySchema = z.object({
  ...BaseStrategySchema.shape,
  ...TypeSchema.shape,
});
export type EmailStrategyProperties = z.input<typeof EmailStrategySchema>;
export type EmailStrategy = z.output<typeof EmailStrategySchema>;

export const EmailStrategyPayloadSchema = z.object({
  ...BaseStrategyPayloadSchema.shape,
  ...TypeSchema.shape,
});
export type EmailStrategyPayload = z.output<typeof EmailStrategyPayloadSchema>;

export const InsertEmailStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseInsertStrategyPayloadSchema.shape,
});
export type InsertEmailStrategyInput = z.input<
  typeof InsertEmailStrategyPayloadSchema
>;
export type InsertEmailStrategyPayload = z.output<
  typeof InsertEmailStrategyPayloadSchema
>;

export const UpdateEmailStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseUpdateStrategyPayloadSchema.shape,
});
export type UpdateEmailStrategyInput = z.input<
  typeof UpdateEmailStrategyPayloadSchema
>;
export type UpdateEmailStrategyPayload = z.output<
  typeof UpdateEmailStrategyPayloadSchema
>;

export const VerifyEmailSchema = z.object({
  email: z.email().optional(),
  code: z.string({ message: 'A verification code is required' }),
});

export const SendEmailVerificationCodeSchema = z.object({
  email: z.email().optional(),
});
