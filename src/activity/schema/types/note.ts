import { type } from 'arktype';
import {
  BaseInsertPayloadSchema,
  BasePayloadSchema,
  BaseUpdatePayloadSchema,
} from '../base.js';

export const NoteActivityPayloadSchema = BasePayloadSchema.and({
  type: type("'note'"),
  message: type('string'),
});
export type NoteActivityPayload = typeof NoteActivityPayloadSchema.inferOut;

export const InsertNoteActivityPayloadSchema = BaseInsertPayloadSchema.and({
  type: type("'note'"),
  message: type('string'),
});
export type InsertNoteActivityPayload =
  typeof InsertNoteActivityPayloadSchema.inferOut;

export const UpdateNoteActivityPayloadSchema = BaseUpdatePayloadSchema.and({
  type: type("'note'"),
  message: type('string').optional(),
});
export type UpdateNoteActivityPayload =
  typeof UpdateNoteActivityPayloadSchema.inferOut;
