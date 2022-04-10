import faker from '@faker-js/faker'
import { createSignal, For, Show } from 'solid-js'
import {
    type ColumnOrderState,
    type VisibilityState,
    createTable,
    useTable,
} from '@izznatsir/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

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
    const [data, setData] = createSignal(makeData(20))
    const [columns] = createSignal([...defaultColumns])

    const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
    const [columnOrder, setColumnOrder] = createSignal<ColumnOrderState>([])

    const rerender = () => setData(() => makeData(20))

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({
            columnVisibility: columnVisibility(),
            columnOrder: columnOrder(),
        }),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    })

    const randomizeColumns = () => {
        instance.setColumnOrder(
            faker.helpers.shuffle(instance.getAllLeafColumns().map((d) => d.id))
        )
    }

    return (
        <div class="p-2">
            <div class="inline-block border border-black shadow rounded">
                <div class="px-1 border-b border-black">
                    <label>
                        <input {...instance.getToggleAllColumnsVisibilityProps()} /> Toggle All
                    </label>
                </div>
                <For each={instance.getAllLeafColumns()}>
                    {(column) => {
                        return (
                            <div class="px-1">
                                <label>
                                    <input {...column.getToggleVisibilityProps()} /> {column.id}
                                </label>
                            </div>
                        )
                    }}
                </For>
            </div>
            <div class="h-4" />
            <div class="flex flex-wrap gap-2">
                <button onClick={() => rerender()} class="border p-1">
                    Regenerate
                </button>
                <button onClick={() => randomizeColumns()} class="border p-1">
                    Shuffle Columns
                </button>
            </div>
            <div class="h-4" />
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
        </div>
    )
}
