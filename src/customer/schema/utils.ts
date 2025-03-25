import KSUID from 'ksuid';

export const Model = {
  Organization: {
    UIDPrefix: 'org',
  },
  User: {
    UIDPrefix: 'usr',
  },
} as const;

export function generateUserId() {
  return `${Model.User.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateOrganizationId() {
  return `${Model.Organization.UIDPrefix}_${KSUID.randomSync().string}`;
}
