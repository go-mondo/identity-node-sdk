import * as z from 'zod/v4';
import { BasePayloadSchema, BaseSchema } from '../base.js';

const BaseUnknownSchema = z.object({
  type: z.literal('unknown'),
  message: z.string(),
});

export const UnknownActivitySchema = z.object({
  ...BaseSchema.shape,
  ...BaseUnknownSchema.shape,
});
export type UnknownActivityProperties = z.input<typeof UnknownActivitySchema>;
export type UnknownActivity = z.output<typeof UnknownActivitySchema>;

export const UnknownActivityPayloadSchema = z.object({
  ...BasePayloadSchema.shape,
  ...BaseUnknownSchema.shape,
});
export type UnknownActivityPayload = z.output<
  typeof UnknownActivityPayloadSchema
>;
