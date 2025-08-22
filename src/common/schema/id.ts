import { z } from 'zod';

export const KSUIDSchema = (prefix: string) =>
  z.string().regex(new RegExp(`^${prefix}_[A-Za-z0-9]{27}$`));
