import { type } from 'arktype';
import { BasePayloadSchema, BaseSchema } from '../base.js';

const BaseUnknownSchema = type({
  type: type("'unknown'"),
  message: type('string'),
});

export const UnknownActivitySchema = BaseSchema.and(BaseUnknownSchema);
export type UnknownActivityProperties = typeof UnknownActivitySchema.inferIn;
export type UnknownActivity = typeof UnknownActivitySchema.inferOut;

export const UnknownActivityPayloadSchema =
  BasePayloadSchema.and(BaseUnknownSchema);
export type UnknownActivityPayload =
  typeof UnknownActivityPayloadSchema.inferOut;
