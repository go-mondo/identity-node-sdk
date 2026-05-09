import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeletedAtPropertyPayloadSchema,
  RequiredDatePayloadSchema,
  UpdatedAtPropertyPayloadSchema,
} from '../../common/schema/dates.js';
import { KSUIDSchema } from '../../common/schema/id.js';
import { MetadataRecordPropertySchema } from '../../common/schema/metadata.js';
import { Model } from './utils.js';

export const ActionOperation = {
  USER_ATTRIBUTE_VERIFICATION: 'user-attribute-verification',

  SIGN_UP: 'sign-up',
  SIGN_UP_VERIFICATION: 'sign-up-verification',
} as const;

export type AnyActionOperation =
  (typeof ActionOperation)[keyof typeof ActionOperation];

export const ActionIdSchema = KSUIDSchema(Model.Action.UIDPrefix);
export type ActionId = z.output<typeof ActionIdSchema>;

export const ActionIdPropertySchema = z.object({
  id: ActionIdSchema,
});
export type ActionIdProperty = z.output<typeof ActionIdPropertySchema>;

export const OperationSchema = z.enum([
  ActionOperation.SIGN_UP,
  ActionOperation.SIGN_UP_VERIFICATION,
  ActionOperation.USER_ATTRIBUTE_VERIFICATION,
] as const);

export const BasePayloadSchema = z.object({
  ...ActionIdPropertySchema.shape,
  attempt: z.number(),
  expiresAt: RequiredDatePayloadSchema,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
