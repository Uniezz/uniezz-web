import type { Components, GridComponents, TableComponents } from 'react-virtuoso';

export const tableHeaderCellClass =
  'border-b border-white-5 px-4 py-3 text-detail font-semibold text-secondary';
export const tableCellTextClass = 'border-t border-white-5 px-4 py-3 text-label text-white-80';

// Virtuoso renders plain divs; these roles keep list semantics for screen readers.
// List rows add role="listitem" on their own root, since a custom Item would pin the row data type to unknown.
export const listComponents: Pick<Components, 'List'> = {
  List: (props) => <div {...props} role="list" />,
};

export const gridComponents: GridComponents = {
  List: (props) => <div {...props} role="list" />,
  Item: (props) => <div {...props} role="listitem" />,
};

/**
 * A fixed-layout table: columns keep their width while rows scroll in and out, instead of resizing
 * to whatever rows are on screen. Empty strings share the leftover width. Call once at module level.
 */
export function fixedTable(columnWidths: string[]): Pick<TableComponents, 'Table'> {
  return {
    Table: ({ children, ...props }) => (
      <table {...props} className="w-full min-w-[640px] table-fixed text-left text-body">
        <colgroup>
          {columnWidths.map((width, index) => (
            <col key={index} style={width ? { width } : undefined} />
          ))}
        </colgroup>
        {children}
      </table>
    ),
  };
}
