import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { UIButton } from '../../src/ui/components/UIButton/UIButton';

const label = (html: string) => html.match(/data-ph-capture-attribute-label="([^"]*)"/)?.[1];

test('UIButton exposes its visible text or aria-label to PostHog', () => {
  expect(label(renderToStaticMarkup(<UIButton>Save</UIButton>))).toBe('Save');
  expect(
    label(
      renderToStaticMarkup(
        <UIButton>
          Join now
          <svg />
        </UIButton>,
      ),
    ),
  ).toBe('Join now');
  expect(
    label(
      renderToStaticMarkup(
        <UIButton aria-label="Close">
          <svg />
        </UIButton>,
      ),
    ),
  ).toBe('Close');
  expect(label(renderToStaticMarkup(<UIButton>{<svg />}</UIButton>))).toBeUndefined();
});
