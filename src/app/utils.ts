import KSUID from 'ksuid';

export const Model = {
  App: {
    UIDPrefix: 'app',
  },
  OAuth: {
    UIDPrefix: 'aoa',
  },
} as const;

export function generateAppId() {
  return `${Model.App.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateOAuthId() {
  return `${Model.OAuth.UIDPrefix}_${KSUID.randomSync().string}`;
}
