import { type } from 'arktype';

export const KSUIDSchema = (prefix: string) =>
  type(`/^${prefix}_[A-Za-z0-9]{27}$/`);
