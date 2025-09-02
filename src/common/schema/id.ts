import * as z from 'zod/v4';

export const KSUIDSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}_[A-Za-z0-9]{27}$`));
