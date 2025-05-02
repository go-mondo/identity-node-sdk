import { type } from 'arktype';
import {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseUpdateStrategyPayloadSchema,
} from '../base.js';

export const DEFAULT_DIGITS = 6;
export const DEFAULT_PERIOD = 30;

const TypeSchema = type({
  type: "'totp'",
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

export const TOTPStrategySettingsSchema = type({
  digits: type.enumerated(6, 7, 8).default(DEFAULT_DIGITS),
  period: type.enumerated(15, 30, 60).default(DEFAULT_PERIOD),
  algorithm: type
    .enumerated(
      TOTPAlgorithm.SHA1,
      TOTPAlgorithm.SHA224,
      TOTPAlgorithm.SHA256,
      TOTPAlgorithm.SHA384,
      TOTPAlgorithm.SHA512,
      TOTPAlgorithm['SHA3-224'],
      TOTPAlgorithm['SHA3-256'],
      TOTPAlgorithm['SHA3-384'],
      TOTPAlgorithm['SHA3-512']
    )
    .default(TOTPAlgorithm.DEFAULT),
});
export type TOTPStrategySettings = typeof TOTPStrategySettingsSchema.inferOut;

export const TOTPStrategySettingsPropertySchema = type({
  settings: TOTPStrategySettingsSchema,
});
export type TOTPStrategySettingsProperty =
  typeof TOTPStrategySettingsPropertySchema.inferOut;

export const TOTPStrategyPayloadSchema = BaseStrategyPayloadSchema.and(
  TypeSchema
).and(TOTPStrategySettingsPropertySchema);
export type TOTPStrategyPayload = typeof TOTPStrategyPayloadSchema.inferOut;

export const InsertTOTPStrategyPayloadSchema =
  BaseInsertStrategyPayloadSchema.and(TypeSchema).and(
    TOTPStrategySettingsPropertySchema
  );
export type InsertTOTPStrategyPayload =
  typeof InsertTOTPStrategyPayloadSchema.inferOut;

export const UpdateTOTPStrategyPayloadSchema =
  BaseUpdateStrategyPayloadSchema.and(TypeSchema).and(
    TOTPStrategySettingsPropertySchema
  );
export type UpdateTOTPStrategyPayload =
  typeof UpdateTOTPStrategyPayloadSchema.inferOut;

export const RegisterTOTPSchema = type({
  uri: type('string.url').configure({
    message: 'An authenticator uri is required',
  }),
  token: type('string').configure({
    message: 'An authenticator token is required',
  }),
});

export const VerifyTOTPSchema = type({
  token: type('string').configure({
    message: 'An authenticator token is required',
  }),
});
