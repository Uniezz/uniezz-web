import { expect, test } from 'bun:test';
import { groupSchema, messageSchema, textFormSchema } from '../../src/schemas';

test('messages trim content and reject blank or oversized messages', () => {
  expect(messageSchema.parse(' Hello ')).toBe('Hello');
  expect(messageSchema.safeParse(' \n ').success).toBe(false);
  expect(messageSchema.safeParse('a'.repeat(4001)).success).toBe(false);
});

test('groups require a name and at least two distinct other students', () => {
  expect(groupSchema.parse({ name: ' Maths ', members: ['Kateryna', 'Taras'] }).name).toBe('Maths');
  for (const data of [
    { name: ' ', members: ['a', 'b'] },
    { name: 'Maths', members: ['a'] },
    { name: 'Maths', members: ['a', 'a'] },
  ])
    expect(groupSchema.safeParse(data).success).toBe(false);
});

test('the message form returns trimmed text and rejects an empty send', () => {
  expect(textFormSchema.parse({ text: ' Hello ' })).toEqual({ text: 'Hello' });
  expect(textFormSchema.safeParse({ text: ' \n ' }).success).toBe(false);
});
