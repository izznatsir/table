import { createSignal, For, Show } from 'solid-js'
import { createTable, paginateRowsFn, useTable } from '@natstack/table-solid'
import { makeData } from './makeData'

type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    status: string
    progress: number
}

const table = createTable<{ Row: Person }>()

const defaultColumns = table.createColumns([
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

export default function App() {
    const [data] = createSignal(makeData(5000))
    const [columns] = createSignal<typeof defaultColumns>([...defaultColumns])

    // Create the instance and pass your options
    const instance = useTable(table, {
        data,
        columns,
        paginateRowsFn: paginateRowsFn,
    })

    // Manage your own state
    const [state, setState] = createSignal(instance.initialState)

    // Override the state managers for the table instance to your own
    instance.setOptions((prev) => ({
        ...prev,
        state,
        onStateChange: setState,
        // These are just table options, so if things
        // need to change based on your state, you can
        // derive them here

        // Just for fun, let's debug everything if the pageIndex
        // is greater than 2
        debugTable: state().pagination.pageIndex > 2,
    }))

    return (
        <div class="p-2">
            <table {...instance.getTableProps()}>
                <thead>
                    <For each={instance.getHeaderGroups()}>
                        {(headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                <For each={headerGroup.headers}>
                                    {(header) => (
                                        <th {...header.getHeaderProps()}>
                                            <Show when={!header.isPlaceholder}>
                                                {header.renderHeader()}
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
                <tfoot>
                    <For each={instance.getFooterGroups()}>
                        {(footerGroup) => (
                            <tr {...footerGroup.getFooterGroupProps()}>
                                <For each={footerGroup.headers}>
                                    {(header) => (
                                        <th {...header.getFooterProps()}>
                                            <Show when={!header.isPlaceholder}>
                                                {header.renderFooter()}
                                            </Show>
                                        </th>
                                    )}
                                </For>
                            </tr>
                        )}
                    </For>
                </tfoot>
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
            <div class="h-4" />
        </div>
    )
}
