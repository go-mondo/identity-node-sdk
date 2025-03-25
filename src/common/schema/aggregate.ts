import { type } from 'arktype';

export const AggregateSchema = type({
  ids: type('string[]').optional(),
  count: type('number[]').optional(),
});
export type Aggregate = typeof AggregateSchema.inferOut;
