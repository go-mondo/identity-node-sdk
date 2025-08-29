import { z } from 'zod';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseStrategySchema,
  BaseUpdateStrategyPayloadSchema,
  StrategyType,
} from '../base.js';

export const DEFAULT_DIGITS = 6;
export const DEFAULT_PERIOD = 30;

const TypeSchema = z.object({
  type: z.literal(StrategyType.TOTP),
});

export const TOTPAlgorithm = {
  DEFAULT: 'SHA256',
  SHA1: 'SHA1',
  SHA224: 'SHA224',
  SHA256: 'SHA256',
  SHA384: 'SHA384',
  SHA512: 'SHA512',
  'SHA3-224': 'SHA3-224',
  'SHA3-256': 'SHA3-256',
  'SHA3-384': 'SHA3-384',
  'SHA3-512': 'SHA3-512',
};

export type AnyTOTPAlgorithm =
  (typeof TOTPAlgorithm)[keyof typeof TOTPAlgorithm];

const allowedDigits = new Set([6, 7, 8]);
const allowedPeriods = new Set([15, 30, 60]);

export const TOTPStrategySettingsSchema = z.object({
  digits: z
    .number()
    .default(DEFAULT_DIGITS)
    .refine((val) => allowedDigits.has(val), {
      message: 'Digit must be 6, 7, or 8',
    }),
  period: z
    .number()
    .default(DEFAULT_PERIOD)
    .refine((val) => allowedPeriods.has(val), {
      message: 'Period must be 15, 30, or 60',
    }),
  algorithm: z
    .enum([
      TOTPAlgorithm.SHA1,
      TOTPAlgorithm.SHA224,
      TOTPAlgorithm.SHA256,
      TOTPAlgorithm.SHA384,
      TOTPAlgorithm.SHA512,
      TOTPAlgorithm['SHA3-224'],
      TOTPAlgorithm['SHA3-256'],
      TOTPAlgorithm['SHA3-384'],
      TOTPAlgorithm['SHA3-512'],
    ] as const)
    .default(TOTPAlgorithm.DEFAULT),
});
export type TOTPStrategySettings = z.output<typeof TOTPStrategySettingsSchema>;

export const TOTPStrategySettingsPropertySchema = z.object({
  settings: TOTPStrategySettingsSchema,
});
export type TOTPStrategySettingsProperty = z.output<
  typeof TOTPStrategySettingsPropertySchema
>;

export const TOTPStrategySchema = z.object({
  ...BaseStrategySchema.shape,
  ...TypeSchema.shape,
  settings: TOTPStrategySettingsSchema,
});
export type TOTPStrategyProperties = z.input<typeof TOTPStrategySchema>;
export type TOTPStrategy = z.output<typeof TOTPStrategySchema>;

export const TOTPStrategyPayloadSchema = z.object({
  ...BaseStrategyPayloadSchema.shape,
  ...TypeSchema.shape,
  ...TOTPStrategySettingsPropertySchema.shape,
});
export type TOTPStrategyPayload = z.output<typeof TOTPStrategyPayloadSchema>;

export const InsertTOTPStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseInsertStrategyPayloadSchema.shape,
  settings: TOTPStrategySettingsSchema.optional(),
});
export type InsertTOTPStrategyInput = z.input<
  typeof InsertTOTPStrategyPayloadSchema
>;
export type InsertTOTPStrategyPayload = z.output<
  typeof InsertTOTPStrategyPayloadSchema
>;

export const UpdateTOTPStrategyPayloadSchema = z.object({
  ...TypeSchema.shape,
  ...BaseUpdateStrategyPayloadSchema.shape,
  settings: TOTPStrategySettingsSchema.optional(),
});
export type UpdateTOTPStrategyInput = z.input<
  typeof UpdateTOTPStrategyPayloadSchema
>;
export type UpdateTOTPStrategyPayload = z.output<
  typeof UpdateTOTPStrategyPayloadSchema
>;

export const RegisterTOTPSchema = z.object({
  uri: z.url('An authenticator uri is required'),
  token: z.string('An authenticator token is required'),
});

export const VerifyTOTPSchema = z.object({
  token: z.string({ message: 'An authenticator token is required' }),
});
