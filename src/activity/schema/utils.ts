import KSUID from 'ksuid';

export const Model = {
  Activity: {
    UIDPrefix: 'act',
  },
} as const;

export function generateActivityId() {
  return `${Model.Activity.UIDPrefix}_${KSUID.randomSync().string}`;
}
