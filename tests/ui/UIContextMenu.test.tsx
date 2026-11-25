import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import type { Option } from '../../src/@types';
import { UIContextMenu } from '../../src/ui/components/UIContextMenu';

const render = (options: Option[]) =>
  renderToStaticMarkup(
    <UIContextMenu options={options} onSelect={() => {}}>
      Hello
    </UIContextMenu>,
  );

test('only the danger action is red', () => {
  const [copy, remove] = render([
    { value: 'copy', label: 'Copy text' },
    { value: 'delete', label: 'Delete', danger: true },
  ])
    .split('<button')
    .slice(1);
  expect(copy).not.toContain('text-danger');
  expect(remove).toContain('text-danger');
});

test('without options there is content, but no menu', () => {
  expect(render([])).toContain('Hello');
  expect(render([])).not.toContain('popover');
});
