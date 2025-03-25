import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { ActionOperation } from './schema.js';

export const ActionIdSchema = type.string;
export type ActionId = typeof ActionIdSchema.inferOut;

export const ActionIdPropertySchema = type({
  id: ActionIdSchema,
});
export type ActionIdProperty = typeof ActionIdPropertySchema.inferOut;

export const OperationSchema = type.enumerated(
  ActionOperation.SIGN_UP,
  ActionOperation.SIGN_UP_VERIFICATION,
  ActionOperation.SET_PASSWORD,
  ActionOperation.USER_ATTRIBUTE_VERIFICATION
);

export const BasePayloadSchema = ActionIdPropertySchema.and({
  attempt: type('number'),
  expiresAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
