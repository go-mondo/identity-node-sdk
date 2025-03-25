import { type } from 'arktype';
import { BasePayloadSchema } from '../base.js';

export const UnknownActivityPayloadSchema = BasePayloadSchema.and({
  type: type("'unknown'"),
  message: type('string'),
});
export type UnknownActivityPayload =
  typeof UnknownActivityPayloadSchema.inferOut;
