import { type } from 'arktype';
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
export type UserNotificationId = typeof UserNotificationIdSchema.inferOut;

export const UserNotificationIdPropertySchema = type({
  id: UserNotificationIdSchema,
});
export type UserNotificationIdProperty =
  typeof UserNotificationIdPropertySchema.inferOut;

const ActionSchema = type({
  link: type('string.url'),
  label: type('string'),
});

const BaseAttributes = type({
  title: type('string | undefined').optional(),
  message: type('string | undefined').optional(),
});

export const UserNotificationPayloadSchema =
  UserNotificationIdPropertySchema.and(BaseAttributes)
    .and({
      type: type.enumerated(NotificationType.IMPORT, NotificationType.INFO),
      action: ActionSchema.or('undefined').optional(),
      createdAt: RequiredDatePayloadSchema,
      updatedAt: RequiredDatePayloadSchema,
      'deletedAt?': OptionalDatePayloadSchema,
      'deactivatedAt?': OptionalDatePayloadSchema,
    })
    .and(MetadataPayloadPropertySchema);
export type UserNotificationPayload =
  typeof UserNotificationPayloadSchema.inferOut;

export const InsertUserNotificationPayloadSchema = type({
  id: UserNotificationIdSchema.default(() => generateNotificationId()),
  type: type.enumerated(NotificationType.INFO),
  action: ActionSchema.optional(),
})
  .and(BaseAttributes)
  .and(MetadataPayloadPropertySchema);
export type InsertUserNotificationPayload =
  typeof InsertUserNotificationPayloadSchema.inferOut;

export const UpdateUserNotificationPayloadSchema = BaseAttributes.and({
  action: ActionSchema.optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdateUserNotificationPayload =
  typeof UpdateUserNotificationPayloadSchema.inferOut;
