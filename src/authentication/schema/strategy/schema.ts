import {
  EmailStrategyPayloadSchema,
  InsertEmailStrategyPayloadSchema,
  UpdateEmailStrategyPayloadSchema,
} from './types/email.js';
import {
  InsertPasswordStrategyPayloadSchema,
  PasswordStrategyPayloadSchema,
  UpdatePasswordStrategyPayloadSchema,
} from './types/password.js';
import {
  InsertTOTPStrategyPayloadSchema,
  TOTPStrategyPayloadSchema,
  UpdateTOTPStrategyPayloadSchema,
} from './types/totp.js';

/**
 * Union(s)
 */
export const InsertStrategyPayloadSchema =
  InsertPasswordStrategyPayloadSchema.or(InsertEmailStrategyPayloadSchema).or(
    InsertTOTPStrategyPayloadSchema
  );
export type InsertStrategyPayload = typeof InsertStrategyPayloadSchema.inferOut;

export const UpdateStrategyPayloadSchema =
  UpdatePasswordStrategyPayloadSchema.or(UpdateEmailStrategyPayloadSchema).or(
    UpdateTOTPStrategyPayloadSchema
  );
export type UpdateStrategyPayload = typeof UpdateStrategyPayloadSchema.inferOut;

export const StrategyPayloadSchema = PasswordStrategyPayloadSchema.or(
  EmailStrategyPayloadSchema.or(TOTPStrategyPayloadSchema)
);
export type StrategyPayload = typeof StrategyPayloadSchema.inferOut;

export {
  BaseInsertStrategyPayloadSchema,
  BaseStrategyPayloadSchema,
  BaseUpdateStrategyPayloadSchema,
  StrategyIdPropertySchema,
  StrategyIdSchema,
  StrategyLabelSchema,
  StrategyStatus,
  StrategyStatusSchema,
  StrategyType,
  type AnyStrategyStatus,
  type AnyStrategyType,
  type StrategyId,
  type StrategyIdProperty,
} from './base.js';
export * from './types/email.js';
export * from './types/password.js';
export * from './types/totp.js';
