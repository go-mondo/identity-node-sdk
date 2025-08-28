import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';
import { KSUIDSchema } from '../../common/schema/id.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { Model } from './utils.js';

export const ActionOperation = {
  SET_PASSWORD: 'set-password',

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
  ActionOperation.SET_PASSWORD,
  ActionOperation.USER_ATTRIBUTE_VERIFICATION,
] as const);

export const BasePayloadSchema = z.object({
  ...ActionIdPropertySchema.shape,
  attempt: z.number(),
  expiresAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
