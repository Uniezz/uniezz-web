import type { Components, GridComponents, TableComponents } from 'react-virtuoso';

// Virtuoso renders plain divs; these roles keep list semantics for screen readers.
// List rows add role="listitem" on their own root, since a custom Item would pin the row data type to unknown.
export const listComponents: Pick<Components, 'List'> = {
  List: (props) => <div {...props} role="list" />,
};

export const gridComponents: GridComponents = {
  List: (props) => <div {...props} role="list" />,
  Item: (props) => <div {...props} role="listitem" />,
};

export const tableComponents: Pick<TableComponents, 'Table'> = {
  Table: (props) => <table {...props} className="w-full min-w-[640px] text-left text-body" />,
};
