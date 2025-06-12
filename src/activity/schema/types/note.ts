import { type } from 'arktype';
import {
  BaseInsertPayloadSchema,
  BasePayloadSchema,
  BaseSchema,
  BaseUpdatePayloadSchema,
} from '../base.js';

const BaseNoteSchema = type({
  type: type("'note'"),
  message: type('string'),
});

export const NoteActivitySchema = BaseSchema.and(BaseNoteSchema);
export type NoteActivityProperties = typeof NoteActivitySchema.inferIn;
export type NoteActivity = typeof NoteActivitySchema.inferOut;

export const NoteActivityPayloadSchema = BasePayloadSchema.and(BaseNoteSchema);
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
