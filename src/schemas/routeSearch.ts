import { z } from 'zod';

export const optionalSearchStringSchema = z.string().max(120).optional().catch(undefined);
