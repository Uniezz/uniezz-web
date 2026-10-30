import { z } from 'zod';
import { messageSchema } from './message';

export const textFormSchema = z.object({ text: messageSchema });

export type TextFormSchema = z.infer<typeof textFormSchema>;
