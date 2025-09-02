import { z } from 'zod';
import {
  CreatedAtPropertyPayloadSchema,
  CreatedAtPropertySchema,
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../../../common/schema/dates.js';
import { KSUIDSchema } from '../../../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../../common/schema/metadata.js';
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

const BaseSchema = z.object({
  title: z.union([z.string(), z.undefined()]).optional(),
  message: z.union([z.string(), z.undefined()]).optional(),
});

export const UserNotificationSchema = z.object({
  ...UserNotificationIdPropertySchema.shape,
  ...BaseSchema.shape,
  type: z.enum([NotificationType.IMPORT, NotificationType.INFO] as const),
  action: z.union([ActionSchema, z.undefined()]).optional(),
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type UserNotificationProperties = z.input<typeof UserNotificationSchema>;
export type UserNotification = z.output<typeof UserNotificationSchema>;

export const UserNotificationPayloadSchema = z.object({
  ...UserNotificationIdPropertySchema.shape,
  ...BaseSchema.shape,
  type: z.enum([NotificationType.IMPORT, NotificationType.INFO] as const),
  action: z.union([ActionSchema, z.undefined()]).optional(),
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type UserNotificationPayload = z.output<
  typeof UserNotificationPayloadSchema
>;

export const InsertUserNotificationPayloadSchema = z.object({
  id: UserNotificationIdSchema.default(() => generateNotificationId()),
  type: z.enum([NotificationType.INFO] as const),
  action: ActionSchema.optional(),
  ...BaseSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type InsertUserNotificationPayload = z.output<
  typeof InsertUserNotificationPayloadSchema
>;

export const UpdateUserNotificationPayloadSchema = z.object({
  ...BaseSchema.shape,
  action: ActionSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type UpdateUserNotificationPayload = z.output<
  typeof UpdateUserNotificationPayloadSchema
>;
