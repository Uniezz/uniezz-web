import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { UIActionMenu } from '../../src/ui/components/UIActionMenu/UIActionMenu';

const html = renderToStaticMarkup(
  <UIActionMenu
    label="More actions"
    options={[
      { value: 'copy', label: 'Copy text' },
      { value: 'delete', label: 'Delete', danger: true },
    ]}
    onSelect={() => {}}
  />,
);

test('the button opens its own menu and has a name for screen readers and analytics', () => {
  const target = html.match(/popoverTarget="([^"]*)"/i)?.[1];
  expect(target).toBeTruthy();
  expect(html).toContain(`id="${target}"`);
  expect(html).toContain('aria-label="More actions"');
  expect(html).toContain('data-ph-capture-attribute-label="More actions"');
});

test('only the danger action is red', () => {
  const [copy, remove] = html.split('<button').slice(2);
  expect(copy).not.toContain('text-danger');
  expect(remove).toContain('text-danger');
});
