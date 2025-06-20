import KSUID from 'ksuid';

export const Model = {
  Action: {
    UIDPrefix: 'atn',
  },
} as const;

export function generateActionId() {
  return `${Model.Action.UIDPrefix}_${KSUID.randomSync().string}`;
}
