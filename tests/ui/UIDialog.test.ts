import { expect, test } from 'bun:test';
import { dialogStyles } from '../../src/ui/components/UIDialog/variants';

test('dialogs remain centered unless the right drawer placement is requested', () => {
  const centered = dialogStyles().split(' ');
  expect(centered).toContain('top-1/2');
  expect(centered).toContain('-translate-x-1/2');
  expect(centered).not.toContain('right-0');
  const drawer = dialogStyles({ placement: 'right' }).split(' ');
  expect(drawer).toContain('right-0');
  expect(drawer).toContain('h-dvh');
  expect(drawer).toContain('w-full');
  expect(drawer).not.toContain('-translate-x-1/2');
  expect(drawer).not.toContain('max-h-[90svh]');
});
