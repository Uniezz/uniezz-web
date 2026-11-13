import { expect, test } from 'bun:test';
import { createCourseSchema, editCourseSchema, courseCommentSchema } from '../../src/schemas/exams';

const course = {
  name: ' Calculus I ',
  description: ' Limits and derivatives ',
  difficulty: 3,
  universityId: 'umcs',
  faculty: 'Mathematics',
  subject: 'Computer science',
  semester: 1,
};

test('course creation trims text and requires all metadata', () => {
  expect(createCourseSchema.parse(course)).toEqual({
    ...course,
    name: 'Calculus I',
    description: 'Limits and derivatives',
  });
  for (const field of ['name', 'description', 'universityId', 'faculty', 'subject'] as const) {
    expect(createCourseSchema.safeParse({ ...course, [field]: ' ' }).success).toBe(false);
  }
  expect(createCourseSchema.safeParse({ ...course, name: 'ab' }).success).toBe(false);
  expect(createCourseSchema.safeParse({ ...course, faculty: 'a'.repeat(151) }).success).toBe(false);
  expect(createCourseSchema.safeParse({ ...course, description: 'a'.repeat(5001) }).success).toBe(
    false,
  );
});

test('difficulty and semester follow the API integer limits', () => {
  for (const difficulty of [0, 6, 1.5, NaN]) {
    expect(createCourseSchema.safeParse({ ...course, difficulty }).success).toBe(false);
  }
  for (const semester of [0, 13, 1.5, NaN]) {
    expect(createCourseSchema.safeParse({ ...course, semester }).success).toBe(false);
  }
  expect(createCourseSchema.safeParse({ ...course, semester: 10, difficulty: 5 }).success).toBe(
    true,
  );
  expect(createCourseSchema.safeParse({ ...course, semester: 12, difficulty: 5 }).success).toBe(
    true,
  );
});

test('course edits contain only fields the API permits changing', () => {
  expect(editCourseSchema.parse(course)).toEqual({
    name: 'Calculus I',
    description: 'Limits and derivatives',
    difficulty: 3,
  });
});

test('course discussions reject blank or oversized comments and trim valid comments', () => {
  expect(courseCommentSchema.parse({ content: ' Useful lectures ' })).toEqual({
    content: 'Useful lectures',
  });
  expect(courseCommentSchema.safeParse({ content: ' ' }).success).toBe(false);
  expect(courseCommentSchema.safeParse({ content: 'a'.repeat(1001) }).success).toBe(false);
  expect(courseCommentSchema.safeParse({ content: 'a'.repeat(1000) }).success).toBe(true);
});
