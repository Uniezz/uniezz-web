import { expect, test } from 'bun:test';
import { uploadSchema } from '../../src/schemas';

test('material university is a required string rather than a fixed set of display names', () => {
  const material = {
    subject: 'Thermodynamics',
    type: 'Exam',
    university: ' Maria Curie-Skłodowska University ',
  };
  expect(uploadSchema.parse(material).university).toBe('Maria Curie-Skłodowska University');
  expect(uploadSchema.safeParse({ ...material, university: '  ' }).success).toBe(false);
});
