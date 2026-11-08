import { z } from 'zod';

export const optionalSearchStringSchema = z.string().max(120).optional().catch(undefined);

/** An in-app path to return to. Rejects `//host` and `/\host`, which browsers treat as other sites. */
export const returnPathSchema = z
  .string()
  .max(500)
  .regex(/^\/(?![/\\])/)
  .optional()
  .catch(undefined);
