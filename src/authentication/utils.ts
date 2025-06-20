import KSUID from 'ksuid';

export const Model = {
  Strategy: {
    UIDPrefix: 'stg',
    TYPE: 'Strategy',
  },
  Session: {
    UIDPrefix: 'ssn',
    TYPE: 'Session',
  },
} as const;

export function generateStrategyId() {
  return `${Model.Strategy.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateSessionId() {
  return `${Model.Session.UIDPrefix}_${KSUID.randomSync().string}`;
}
