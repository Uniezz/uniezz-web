import { expect, test } from 'bun:test';
import { uploadSchema, studyMaterialFileSchema } from '../../src/schemas/exams';

test('materials require a title, supported type and real file', () => {
  const file = new File(['pdf'], 'notes.pdf', { type: 'application/pdf' });
  expect(uploadSchema.parse({ title: ' Notes ', type: 'notes', file }).title).toBe('Notes');
  for (const values of [
    { title: ' ', type: 'notes', file },
    { title: 'ab', type: 'notes', file },
    { title: 'Notes', type: 'slides', file },
    { title: 'Notes', type: 'notes' },
  ])
    expect(uploadSchema.safeParse(values).success).toBe(false);
});

test('study uploads enforce PDF and image size and MIME limits', () => {
  expect(
    studyMaterialFileSchema.safeParse(
      new File([new Uint8Array(20 * 1024 * 1024)], 'a.pdf', { type: 'application/pdf' }),
    ).success,
  ).toBe(true);
  for (const file of [
    new File([], 'a.pdf', { type: 'application/pdf' }),
    new File(['x'], 'a.svg', { type: 'image/svg+xml' }),
    new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'a.pdf', { type: 'application/pdf' }),
    new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'a.png', { type: 'image/png' }),
  ])
    expect(studyMaterialFileSchema.safeParse(file).success).toBe(false);
});
