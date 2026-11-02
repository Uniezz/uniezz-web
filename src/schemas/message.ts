import { z } from 'zod';

export const messageSchema = z.string().trim().min(1).max(4000);
