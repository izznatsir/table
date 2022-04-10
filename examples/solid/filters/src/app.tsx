import { createSignal, For } from 'solid-js'
import {
    type Column,
    type ColumnFiltersState,
    type TableInstance,
    createTable,
    columnFilterRowsFn,
    globalFilterRowsFn,
    useTable,
} from '@natstack/table-solid'
import { makeData, Person } from './makeData'

let table = createTable<{ Row: Person }>()

export default function App() {
    const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = createSignal('')

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

    const [data, setData] = createSignal(makeData(100000))
    const refreshData = () => setData(makeData(100000))

    const instance = useTable(table, {
        data,
        columns,
        state: () => ({
            columnFilters: columnFilters(),
            globalFilter: globalFilter(),
        }),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        columnFilterRowsFn,
        globalFilterRowsFn,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
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
                    <For each={instance.getRowModel().rows.slice(0, 10)}>
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
            <div>{instance.getRowModel().rows.length} Rows</div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <pre>{JSON.stringify(columnFilters(), null, 2)}</pre>
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
