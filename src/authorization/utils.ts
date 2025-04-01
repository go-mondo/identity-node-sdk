import KSUID from 'ksuid';

export const Model = {
  Permission: {
    UIDPrefix: 'per',
  },
  Role: {
    UIDPrefix: 'rol',
  },
} as const;

export function generatePermissionId() {
  return `${Model.Permission.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateRoleId() {
  return `${Model.Role.UIDPrefix}_${KSUID.randomSync().string}`;
}
