import { createSignal, For, Show } from 'solid-js'
import {
    createTable,
    columnFilterRowsFn,
    paginateRowsFn,
    Column,
    TableInstance,
    PaginationState,
    useTable,
} from '@natstack/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

export default function App() {
    const columns = table.createColumns([
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

    const [data, setData] = createSignal(makeData(5000))
    const refreshData = () => setData(makeData(5000))

    const [pagination, setPagination] = createSignal<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
        pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
    })

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({
            pagination: pagination(),
        }),
        onPaginationChange: setPagination,
        paginateRowsFn,
        columnFilterRowsFn,
        // debugTable: true,
    })

    return (
        <div class="p-2">
            <div class="h-2" />
            <table {...instance.getTableProps({})}>
                <thead>
                    <For each={instance.getHeaderGroups()}>
                        {(headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <For each={headerGroup.headers}>
                                    {(header) => (
                                        <th {...header.getHeaderProps()}>
                                            <Show when={!header.isPlaceholder}>
                                                <div>
                                                    {header.renderHeader()}
                                                    <Show when={header.column.getCanColumnFilter()}>
                                                        <div>
                                                            <Filter
                                                                column={header.column}
                                                                instance={instance}
                                                            />
                                                        </div>
                                                    </Show>
                                                </div>
                                            </Show>
                                        </th>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </thead>
                <tbody {...instance.getTableBodyProps()}>
                    <For each={instance.getRowModel().rows}>
                        {(row) => (
                            <tr {...row.getRowProps()}>
                                <For each={row.getVisibleCells()}>
                                    {(cell) => (
                                        <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                                    )}
                                </For>
                            </tr>
                        )}
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
            <div>{instance.getRowModel().rows.length} Rows</div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <pre>{JSON.stringify(pagination(), null, 2)}</pre>
        </div>
    )
}

function Filter({ column, instance }: { column: Column<any>; instance: TableInstance<any> }) {
    const firstValue = instance.getPreColumnFilteredRowModel().flatRows[0].values[column.id]

    return (
        <Show
            when={typeof firstValue === 'number'}
            fallback={
                <input
                    type="text"
                    value={(column.getColumnFilterValue() ?? '') as string}
                    onInput={(e) => column.setColumnFilterValue(e.currentTarget.value)}
                    placeholder={`Search... (${column.getPreFilteredUniqueValues().size})`}
                    class="w-36 border shadow rounded"
                />
            }
        >
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
        </Show>
    )
}
