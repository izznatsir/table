import { type JSX, createEffect, createSignal, For, splitProps } from 'solid-js'
import {
    type Column,
    type PaginationState,
    type RowSelectionState,
    type TableInstance,
    createTable,
    columnFilterRowsFn,
    globalFilterRowsFn,
    paginateRowsFn,
    useTable,
} from '@natstack/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

export default function App() {
    const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({})
    const [globalFilter, setGlobalFilter] = createSignal('')

    const columns = table.createColumns([
        table.createDisplayColumn({
            id: 'select',
            header: ({ instance }) => (
                <IndeterminateCheckbox {...instance.getToggleAllRowsSelectedProps()} />
            ),
            cell: ({ row }) => (
                <div class="px-1">
                    <IndeterminateCheckbox {...row.getToggleSelectedProps()} />
                </div>
            ),
        }),
        table.createGroup({
            header: 'Name',
            footer: (props) => props.column.id,
            columns: [
                table.createDataColumn('firstName', {
                    cell: (info) => info.value,
                    footer: (props) => props.column.id,
                }),
                table.createDataColumn((row) => row.lastName, {
                    id: 'lastName',
                    cell: (info) => info.value,
                    header: () => <span>Last Name</span>,
                    footer: (props) => props.column.id,
                }),
            ],
        }),
        table.createGroup({
            header: 'Info',
            footer: (props) => props.column.id,
            columns: [
                table.createDataColumn('age', {
                    header: () => 'Age',
                    footer: (props) => props.column.id,
                }),
                table.createGroup({
                    header: 'More Info',
                    columns: [
                        table.createDataColumn('visits', {
                            header: () => <span>Visits</span>,
                            footer: (props) => props.column.id,
                        }),
                        table.createDataColumn('status', {
                            header: 'Status',
                            footer: (props) => props.column.id,
                        }),
                        table.createDataColumn('progress', {
                            header: 'Profile Progress',
                            footer: (props) => props.column.id,
                        }),
                    ],
                }),
            ],
        }),
    ])

    const [data, setData] = createSignal(makeData(1000))
    const refreshData = () => setData(makeData(1000))

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({
            globalFilter: globalFilter(),
            rowSelection: rowSelection(),
        }),
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        columnFilterRowsFn,
        globalFilterRowsFn,
        paginateRowsFn,
        debugTable: true,
    })

    return (
        <div class="p-2">
            <div>
                <input
                    value={globalFilter() ?? ''}
                    onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                    class="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div>
            <div class="h-2" />
            <table {...instance.getTableProps({})}>
                <thead>
                    <For each={instance.getHeaderGroups()}>
                        {(headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <For each={headerGroup.headers}>
                                    {(header) => {
                                        return (
                                            <th {...header.getHeaderProps()}>
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        {header.renderHeader()}
                                                        {header.column.getCanColumnFilter() ? (
                                                            <div>
                                                                <Filter
                                                                    column={header.column}
                                                                    instance={instance}
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </>
                                                )}
                                            </th>
                                        )
                                    }}
                                </For>
                            </tr>
                        )}
                    </For>
                </thead>
                <tbody {...instance.getTableBodyProps()}>
                    <For each={instance.getRowModel().rows}>
                        {(row) => {
                            return (
                                <tr {...row.getRowProps()}>
                                    <For each={row.getVisibleCells()}>
                                        {(cell) => {
                                            return (
                                                <td {...cell.getCellProps()}>
                                                    {cell.renderCell()}
                                                </td>
                                            )
                                        }}
                                    </For>
                                </tr>
                            )
                        }}
                    </For>
                </tbody>
            </table>
            <div class="h-2" />
            <div class="flex items-center gap-2">
                <button
                    class="border rounded p-1"
                    onClick={() => instance.setPageIndex(0)}
                    disabled={!instance.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    class="border rounded p-1"
                    onClick={() => instance.previousPage()}
                    disabled={!instance.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    class="border rounded p-1"
                    onClick={() => instance.nextPage()}
                    disabled={!instance.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    class="border rounded p-1"
                    onClick={() => instance.setPageIndex(instance.getPageCount() - 1)}
                    disabled={!instance.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span class="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {instance.getState().pagination.pageIndex + 1} of {instance.getPageCount()}
                    </strong>
                </span>
                <span class="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        value={instance.getState().pagination.pageIndex + 1}
                        onInput={(e) => {
                            const page = e.currentTarget.value
                                ? Number(e.currentTarget.value) - 1
                                : 0
                            instance.setPageIndex(page)
                        }}
                        class="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={instance.getState().pagination.pageSize}
                    onChange={(e) => {
                        instance.setPageSize(Number(e.currentTarget.value))
                    }}
                >
                    <For each={[10, 20, 30, 40, 50]}>
                        {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
                    </For>
                </select>
            </div>
            <br />
            <div>
                {Object.keys(rowSelection).length} of{' '}
                {instance.getPreFilteredRowModel().rows.length} Total Rows Selected
            </div>
            <hr />
            <br />
            <div>
                <button class="border rounded p-2 mb-2" onClick={() => refreshData()}>
                    Refresh Data
                </button>
            </div>
            <div>
                Selected row indexes:
                <div>{JSON.stringify(instance.getState().rowSelection, null, 2)}</div>
            </div>
            <div>
                <button
                    class="border rounded p-2 mb-2"
                    onClick={() =>
                        console.log(
                            'instance.getSelectedFlatRows()',
                            instance.getSelectedRowModel().flatRows
                        )
                    }
                >
                    Log instance.getSelectedFlatRows()
                </button>
            </div>
        </div>
    )
}

function Filter({ column, instance }: { column: Column<any>; instance: TableInstance<any> }) {
    const firstValue = instance.getPreColumnFilteredRowModel().flatRows[0].values[column.id]

    return typeof firstValue === 'number' ? (
        <div class="flex space-x-2">
            <input
                type="number"
                min={Number(column.getPreFilteredMinMaxValues()[0])}
                max={Number(column.getPreFilteredMinMaxValues()[1])}
                // @ts-expect-error
                value={(column.getColumnFilterValue()?.[0] ?? '') as string}
                onInput={(e) =>
                    column.setColumnFilterValue((old: any) => [e.currentTarget.value, old?.[1]])
                }
                placeholder={`Min (${column.getPreFilteredMinMaxValues()[0]})`}
                class="w-24 border shadow rounded"
            />
            <input
                type="number"
                min={Number(column.getPreFilteredMinMaxValues()[0])}
                max={Number(column.getPreFilteredMinMaxValues()[1])}
                // @ts-expect-error
                value={(column.getColumnFilterValue()?.[1] ?? '') as string}
                onInput={(e) =>
                    column.setColumnFilterValue((old: any) => [old?.[0], e.currentTarget.value])
                }
                placeholder={`Max (${column.getPreFilteredMinMaxValues()[1]})`}
                class="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <input
            type="text"
            value={(column.getColumnFilterValue() ?? '') as string}
            onInput={(e) => column.setColumnFilterValue(e.currentTarget.value)}
            placeholder={`Search... (${column.getPreFilteredUniqueValues().size})`}
            class="w-36 border shadow rounded"
        />
    )
}

function IndeterminateCheckbox(
    props: { indeterminate?: boolean } & JSX.HTMLAttributes<HTMLInputElement>
) {
    const [local, others] = splitProps(props, ['class', 'indeterminate'])

    let ref: HTMLInputElement | undefined = undefined

    createEffect(() => {
        if (!ref) return

        ref.indeterminate = local.indeterminate ? local.indeterminate : false
    })

    return (
        <input type="checkbox" ref={ref} class={'cursor-pointer' + ' ' + local.class} {...others} />
    )
}
