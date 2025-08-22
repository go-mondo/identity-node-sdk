import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../../common/schema/dates.js';
import { KSUIDSchema } from '../../../common/schema/id.js';
import { MetadataPayloadPropertySchema } from '../../../common/schema/metadata.js';
import { Model, generateNotificationId } from '../../utils.js';

export const NotificationType = {
  INFO: 'info',
  IMPORT: 'import',
} as const;

export type AnyNotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const UserNotificationIdSchema = KSUIDSchema(
  Model.Notification.UIDPrefix
);
export type UserNotificationId = z.output<typeof UserNotificationIdSchema>;

export const UserNotificationIdPropertySchema = z.object({
  id: UserNotificationIdSchema,
});
export type UserNotificationIdProperty = z.output<
  typeof UserNotificationIdPropertySchema
>;

const ActionSchema = z.object({
  link: z.url(),
  label: z.string(),
});

const BaseAttributes = z.object({
  title: z.union([z.string(), z.undefined()]).optional(),
  message: z.union([z.string(), z.undefined()]).optional(),
});

export const UserNotificationPayloadSchema = z.object({
  ...UserNotificationIdPropertySchema.shape,
  ...BaseAttributes.shape,
  type: z.enum([NotificationType.IMPORT, NotificationType.INFO] as const),
  action: z.union([ActionSchema, z.undefined()]).optional(),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type UserNotificationPayload = z.output<
  typeof UserNotificationPayloadSchema
>;

export const InsertUserNotificationPayloadSchema = z.object({
  id: UserNotificationIdSchema.default(() => generateNotificationId()),
  type: z.enum([NotificationType.INFO] as const),
  action: ActionSchema.optional(),
  ...BaseAttributes.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type InsertUserNotificationPayload = z.output<
  typeof InsertUserNotificationPayloadSchema
>;

export const UpdateUserNotificationPayloadSchema = z.object({
  ...BaseAttributes.shape,
  action: ActionSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type UpdateUserNotificationPayload = z.output<
  typeof UpdateUserNotificationPayloadSchema
>;
