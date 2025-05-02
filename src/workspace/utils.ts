import KSUID from 'ksuid';
import * as crypto from 'node:crypto';

export const Model = {
  Action: {
    UIDPrefix: 'act',
  },
  Notification: {
    UIDPrefix: 'ntf',
  },
  Tenant: {
    UIDPrefix: 'tnt',
  },
} as const;

export function generateTenantId() {
  return `${Model.Tenant.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateHandle() {
  return crypto.randomBytes(6).toString('hex');
}

export function generateNotificationId() {
  return `${Model.Notification.UIDPrefix}_${KSUID.randomSync().string}`;
}
