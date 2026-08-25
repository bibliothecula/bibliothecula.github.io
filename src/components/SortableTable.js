import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function SortableTable({ columns, data, filters = [] }) {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnFilters, setColumnFilters] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    globalFilterFn: 'includesString',
    filterFns: {
    multiSelect: (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length === 0) {
      return true;
    }

    return filterValue.includes(row.getValue(columnId));
  },
},
  });

  function clearFilters() {
    setGlobalFilter('');
    setColumnFilters([]);
  }

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search resources..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem',
          marginBottom: '1rem',
        }}
      />

      {/* Filters */}
      {filters.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {filters.map(filter => {
            const column = table.getColumn(filter.id);

            if (!column) return null;

            const selected =
              column.getFilterValue() || [];

            function toggleValue(value) {
              const current = column.getFilterValue() || [];

              const next = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];

              column.setFilterValue(
                next.length > 0 ? next : undefined
              );
            }

            return (
              <div key={filter.id}>
                <strong>{filter.label}</strong>

                {filter.options.map(option => (
                  <label
                    key={option}
                    style={{
                      display: 'block',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() => toggleValue(option)}
                    />{' '}
                    {option}
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Clear filters */}
      {(globalFilter || columnFilters.length > 0) && (
        <button
          onClick={clearFilters}
          style={{
            marginBottom: '1rem',
          }}
        >
          Clear filters
        </button>
      )}

      {/* Table */}
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted()] ?? ''}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Result count */}
      <p>
        Showing {table.getFilteredRowModel().rows.length} of{' '}
        {data.length} resources
      </p>
    </div>
  );
}
