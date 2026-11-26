import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import type { Option } from '../../src/@types';
import { UIContextMenu } from '../../src/ui/components/UIContextMenu';

const render = (options: Option[]) =>
  renderToStaticMarkup(
    <UIContextMenu options={options} onSelect={() => {}} label="Message actions">
      Hello
    </UIContextMenu>,
  );

test('only the danger action is red', () => {
  const [copy, remove] = render([
    { value: 'copy', label: 'Copy text' },
    { value: 'delete', label: 'Delete', danger: true },
  ])
    .split('<button')
    // The first button is the "…" trigger.
    .slice(2);
  expect(copy).not.toContain('text-danger');
  expect(remove).toContain('text-danger');
});

test('the "…" button opens the menu and has a name', () => {
  const html = render([{ value: 'copy', label: 'Copy text' }]);
  expect(html).toContain('aria-label="Message actions"');
  expect(html).toMatch(/popovertarget="context-menu-/i);
});

test('without options there is content, but no menu', () => {
  expect(render([])).toContain('Hello');
  expect(render([])).not.toContain('popover');
});
